import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormDescription, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEvent } from "@/lib/event";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';

// Define region type to ensure type safety
type Region = "Africa" | "Asia" | "Europe" | "North America" | "South America" | "Oceania" | "Antarctica";

// Define subregion type for Africa
type AfricaSubRegion = "North Africa" | "West Africa" | "East Africa" | "Central Africa" | "Southern Africa";
type AsiaSubRegion = "East Asia" | "Southeast Asia" | "South Asia" | "Central Asia" | "Western Asia";
type EuropeSubRegion = "Northern Europe" | "Western Europe" | "Eastern Europe" | "Southern Europe";
type NorthAmericaSubRegion = "Northern America" | "Central America" | "Caribbean";
type SouthAmericaSubRegion = "Brazil and the Guianas" | "Andes Nations" | "Southern Cone";
type OceaniaSubRegion = "Australia and New Zealand" | "Melanesia" | "Micronesia" | "Polynesia";
type AntarcticaSubRegion = "Antarctic region";

// Union type of all subregions
type SubRegion = AfricaSubRegion | AsiaSubRegion | EuropeSubRegion | NorthAmericaSubRegion | 
                SouthAmericaSubRegion | OceaniaSubRegion | AntarcticaSubRegion;

// Data for dropdowns
const regions: Region[] = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Antarctica"
];

const subRegions: Record<Region, string[]> = {
  "Africa": ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"],
  "Asia": ["East Asia", "Southeast Asia", "South Asia", "Central Asia", "Western Asia"],
  "Europe": ["Northern Europe", "Western Europe", "Eastern Europe", "Southern Europe"],
  "North America": ["Northern America", "Central America", "Caribbean"],
  "South America": ["Brazil and the Guianas", "Andes Nations", "Southern Cone"],
  "Oceania": ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
  "Antarctica": ["Antarctic region"]
};

const countries: Record<SubRegion, string[]> = {
  "North Africa": ["Algeria", "Egypt", "Libya", "Morocco", "Tunisia"],
  "West Africa": ["Benin", "Burkina Faso", "Côte d'Ivoire", "Ghana", "Guinea", "Liberia", "Mali", "Niger", "Nigeria", "Senegal"],
  "East Africa": ["Ethiopia", "Kenya", "Rwanda", "Somalia", "Tanzania", "Uganda"],
  "Central Africa": ["Cameroon", "Central African Republic", "Chad", "Democratic Republic of the Congo", "Republic of the Congo"],
  "Southern Africa": ["Angola", "Botswana", "Lesotho", "Malawi", "Mozambique", "Namibia", "South Africa", "Zambia", "Zimbabwe"],
  // Add other subregion countries
  "East Asia": ["China", "Japan", "Mongolia", "North Korea", "South Korea", "Taiwan"],
  "Southeast Asia": ["Brunei", "Cambodia", "Indonesia", "Laos", "Malaysia", "Myanmar", "Philippines", "Singapore", "Thailand", "Vietnam"],
  "South Asia": ["Bangladesh", "Bhutan", "India", "Maldives", "Nepal", "Pakistan", "Sri Lanka"],
  "Central Asia": ["Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Uzbekistan"],
  "Western Asia": ["Armenia", "Azerbaijan", "Bahrain", "Cyprus", "Georgia", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon"],
  "Northern Europe": ["Denmark", "Estonia", "Finland", "Iceland", "Ireland", "Latvia", "Lithuania", "Norway", "Sweden", "United Kingdom"],
  "Western Europe": ["Austria", "Belgium", "France", "Germany", "Liechtenstein", "Luxembourg", "Monaco", "Netherlands", "Switzerland"],
  "Eastern Europe": ["Belarus", "Bulgaria", "Czech Republic", "Hungary", "Moldova", "Poland", "Romania", "Russia", "Slovakia", "Ukraine"],
  "Southern Europe": ["Albania", "Andorra", "Bosnia and Herzegovina", "Croatia", "Greece", "Italy", "Malta", "Montenegro", "North Macedonia", "Portugal"],
  "Northern America": ["Canada", "United States"],
  "Central America": ["Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama"],
  "Caribbean": ["Antigua and Barbuda", "Bahamas", "Barbados", "Cuba", "Dominica", "Dominican Republic", "Grenada", "Haiti", "Jamaica"],
  "Brazil and the Guianas": ["Brazil", "Guyana", "Suriname", "French Guiana"],
  "Andes Nations": ["Bolivia", "Colombia", "Ecuador", "Peru", "Venezuela"],
  "Southern Cone": ["Argentina", "Chile", "Paraguay", "Uruguay"],
  "Australia and New Zealand": ["Australia", "New Zealand"],
  "Melanesia": ["Fiji", "Papua New Guinea", "Solomon Islands", "Vanuatu"],
  "Micronesia": ["Kiribati", "Marshall Islands", "Micronesia", "Nauru", "Palau"],
  "Polynesia": ["Samoa", "Tonga", "Tuvalu"],
  "Antarctic region": ["Antarctic Treaty area"]
};

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
  region: z.string().min(2, "Region is required"),
  subRegion: z.string().optional(),
  nation: z.string().min(2, "Nation is required"),
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
  
  // Get session data
  const { data: session, status } = useSession();
  
  // Default UUIDs for organization and user if not available from session
  const defaultOrgId = uuidv4();
  const defaultUserId = uuidv4();

  // Get real or fallback UUIDs
  const orgId = session?.user?.organizationId || defaultOrgId;
  const createdBy = session?.user?.id || defaultUserId;

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
      region: "",
      subRegion: "",
      nation: "",
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

  // Watch for region changes to update subRegion options
  const selectedRegion = form.watch("region") as Region | "";
  const selectedSubRegion = form.watch("subRegion") as SubRegion | "";
  const isPaid = form.watch("isPaid");

  // Reset subRegion when region changes
  useEffect(() => {
    form.setValue("subRegion", "");
    form.setValue("nation", "");
  }, [selectedRegion, form]);

  // Reset nation when subRegion changes
  useEffect(() => {
    form.setValue("nation", "");
  }, [selectedSubRegion, form]);

  async function onSubmit(data: EventFormValues) {
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
    } catch (error) {
      console.error("Failed to create event:", error);
      // Handle error - show error message to user
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
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
                  name="subRegion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Region</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""} 
                        disabled={!selectedRegion}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sub-region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedRegion && subRegions[selectedRegion as Region]?.map((subRegion) => (
                            <SelectItem key={subRegion} value={subRegion}>
                              {subRegion}
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
                  name="nation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nation</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""} 
                        disabled={!selectedSubRegion}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedSubRegion && countries[selectedSubRegion as SubRegion]?.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
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
                      <FormControl>
                        <Input placeholder="Accra" {...field} />
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