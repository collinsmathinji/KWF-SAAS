import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormDescription, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEvent } from "@/lib/event";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { AlertCircle, X, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Country, State, City } from 'country-state-city';

const eventFormSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters"),
  startDate: z.date(),
  isPaid: z.boolean(),
  price: z.coerce.number().optional().nullable(),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day"),
  eventType: z.string().min(2, "Event type is required"),
  theme: z.string().min(2, "Theme is required"),
  hostOrganization: z.string().min(2, "Host organization is required"),
  coHost: z.string().optional(),
  sponsor: z.string().optional(),
  countryCode: z.string().min(2, "Country is required"),
  stateCode: z.string().optional(),
  city: z.string().min(2, "City is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  capacity: z.string().optional(),
  location: z.string().optional(),
  organizationId: z.string().min(1, "Organization is required"),
  createdBy: z.string().min(1, "Creator ID is required"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  onSuccess?: (data: any) => void;
  onClose?: () => void;
}

const EventForm = ({ onSuccess, onClose }: EventFormProps) => {
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStripeError, setIsStripeError] = useState(false);
  const [stripeOnboardingUrl, setStripeOnboardingUrl] = useState<string | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  
  // Get session data
  const { data: session, status } = useSession();
  
  // Default UUIDs for organization and user if not available from session
  const defaultOrgId = uuidv4();
  const defaultUserId = uuidv4();

  // Get real or fallback UUIDs
  const orgId = session?.user?.organizationId || defaultOrgId;
  const createdBy = session?.user?.id || defaultUserId;

  // Get list of countries, will be used for dropdown
  const countries = Country.getAllCountries();

  // State for storing states and cities based on selected country/state
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      isPaid: false,
      price: null,
      duration: 1,
      eventType: "",
      theme: "",
      hostOrganization: "",
      coHost: "",
      sponsor: "",
      countryCode: "",
      stateCode: "",
      city: "",
      description: "",
      organizationId: orgId,
      createdBy: createdBy,
    },
  });

  // Update fields when session data changes
  useEffect(() => {
    if (session?.user?.id) {
      form.setValue("createdBy", session.user.id);
    }
    
    if (session?.user?.organizationId) {
      form.setValue("organizationId", session.user.organizationId);
    }
  }, [session, form]);

  // Watch form fields for dependencies
  const isPaid = form.watch("isPaid");
  const selectedCountryCode = form.watch("countryCode");
  const selectedStateCode = form.watch("stateCode");

  // Update states when country changes
  useEffect(() => {
    if (selectedCountryCode) {
      const countryStates = State.getStatesOfCountry(selectedCountryCode);
      setStates(countryStates);
      form.setValue("stateCode", "");
      form.setValue("city", "");
    } else {
      setStates([]);
    }
  }, [selectedCountryCode, form]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedCountryCode && selectedStateCode) {
      const stateCities = City.getCitiesOfState(selectedCountryCode, selectedStateCode);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [selectedCountryCode, selectedStateCode]);

  // Stripe onboarding function
  const initiateStripeOnboarding = async () => {
    try {
      setIsStripeLoading(true);
      const response = await fetch('http://localhost:5000/admin/organization/stripe/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        }
      });
      console.log("session.accesstoken",session?.accessToken)
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate Stripe onboarding');
      }
      
      setStripeOnboardingUrl(data.data.onboardingUrl);
      
      // Attempt to open the URL in a new tab
      const newWindow = window.open(data.data.onboardingUrl, '_blank');
      
      // If popup was blocked, we'll let the user click a button instead
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.log('Popup blocked, user will need to click the button');
      }
      
      return data.data; // Contains stripeAccountId and onboardingUrl
    } catch (error) {
      console.error('Error initiating Stripe onboarding:', error);
      throw error;
    } finally {
      setIsStripeLoading(false);
    }
  };

  // Handle Stripe onboarding button click
  const handleStripeOnboarding = async () => {
    try {
      await initiateStripeOnboarding();
    } catch (error) {
      console.error("Stripe onboarding failed:", error);
      setError("Failed to initiate Stripe onboarding. Please try again.");
    }
  };

  // Check if error is related to Stripe onboarding
  const checkForStripeError = (errorMessage: string) => {
    const stripeOnboardingErrorPattern = /Your organization's Stripe account is not fully enabled for charges or payouts. Please complete onboarding/i;
    return stripeOnboardingErrorPattern.test(errorMessage);
  };

  async function onSubmit(data: EventFormValues) {
    // Clear any previous errors
    setError(null);
    setIsStripeError(false);
    setStripeOnboardingUrl(null);
    
    try {
      setIsSubmitting(true);
      
      // Format the data according to API validation requirements
      const eventData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        duration: Number(data.duration),
        price: data.isPaid ? Number(data.price) : 0,
        organizationId: data.organizationId || defaultOrgId,
        createdBy: data.createdBy || defaultUserId,
        addedBy: createdBy,
      };

      console.log("Submitting event data:", eventData);

      const response = await createEvent(eventData);
      console.log(session?.accessToken)
      console.log("Event created successfully:", response);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response);
      }
      
      // Close the modal if onClose is provided
      if (onClose) {
        onClose();
      }
      
      // Reset the form
      form.reset();
    } catch (error: any) {
      console.error("Failed to create event:", error);
      
      // Extract error message
      let errorMessage = "Failed to create event. Please try again.";
      
      if (error.response) {
        // If it's an axios error with a response
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        // If it has a generic message property
        errorMessage = error.message;
      }
      
      // Check if this is a Stripe onboarding error
      if (checkForStripeError(errorMessage)) {
        setIsStripeError(true);
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error display */}
        {error && (
          <Alert variant={isStripeError ? "warning" : "destructive"} className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isStripeError ? "Stripe Account Required" : "Error"}</AlertTitle>
            <div className="flex justify-between items-start">
              <AlertDescription className="mt-1">
                {error}
                {isStripeError && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleStripeOnboarding}
                      disabled={isStripeLoading}
                    >
                      {isStripeLoading ? "Processing..." : "Retry Stripe Onboarding"}
                    </Button>
                    
                    {stripeOnboardingUrl && (
                      <div className="mt-2 text-sm">
                        <p>If a new window didn't open, click the button below:</p>
                        <Button 
                          variant="link" 
                          className="flex items-center gap-1 p-0 h-auto text-blue-600"
                          onClick={() => window.open(stripeOnboardingUrl, '_blank')}
                        >
                          Open Stripe Onboarding <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </AlertDescription>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => {
                  setError(null);
                  setIsStripeError(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 gap-2">
            <TabsTrigger value="general" className="text-center">General</TabsTrigger>
            <TabsTrigger value="details" className="text-center">Details</TabsTrigger>
            <TabsTrigger value="location" className="text-center">Location</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Women in Tech Bootcamp" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date Input */}
                        <div className="flex flex-col space-y-2">
                          <Input
                            type="date"
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                const dateValue = new Date(e.target.value);
                                // Preserve the current time
                                const currentTime = field.value || new Date();
                                dateValue.setHours(currentTime.getHours());
                                dateValue.setMinutes(currentTime.getMinutes());
                                field.onChange(dateValue);
                              }
                            }}
                            className="w-full"
                          />
                        </div>
                        
                        {/* Time input */}
                        <div>
                          <Input
                            type="time"
                            value={field.value ? 
                              `${field.value.getHours().toString().padStart(2, '0')}:${field.value.getMinutes().toString().padStart(2, '0')}` 
                              : "00:00"
                            }
                            onChange={(e) => {
                              if (e.target.value) {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newDate = new Date(field.value || new Date());
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                field.onChange(newDate);
                              }
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isPaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Paid Event</FormLabel>
                        <FormDescription>Check if this is a paid event</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {isPaid && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00"
                            value={field.value === null ? "" : field.value} 
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : parseFloat(e.target.value);
                              field.onChange(value);
                            }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? 1 : parseInt(e.target.value, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Bootcamp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <Input placeholder="Digital Inclusion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hostOrganization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="WomenCode Africa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coHost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Co-Host</FormLabel>
                      <FormControl>
                        <Input placeholder="SheBuilds" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sponsor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsor</FormLabel>
                      <FormControl>
                        <Input placeholder="Tech Sisters Fund" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Event Location</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {countries.map((country:any) => (
                            <SelectItem key={country.isoCode} value={country.isoCode}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stateCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""} 
                        disabled={!selectedCountryCode || states.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              selectedCountryCode && states.length === 0 
                                ? "No states available for this country" 
                                : "Select a state/province"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {states.map((state) => (
                            <SelectItem key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      {cities.length > 0 ? (
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {cities.map((city) => (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input placeholder="Enter city name" {...field} />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue/Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Conference Center, 123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter event description..." 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            type="submit" 
            className="w-full md:w-auto" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventForm;