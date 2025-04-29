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
import { v4 as uuidv4 } from 'uuid'; // Make sure to install this package: npm install uuid

// Data for dropdowns
const regions = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Antarctica"
];

const subRegions = {
  Africa: ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"],
  Asia: ["East Asia", "Southeast Asia", "South Asia", "Central Asia", "Western Asia"],
  Europe: ["Northern Europe", "Western Europe", "Eastern Europe", "Southern Europe"],
  "North America": ["Northern America", "Central America", "Caribbean"],
  "South America": ["Brazil and the Guianas", "Andes Nations", "Southern Cone"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
  Antarctica: ["Antarctic region"]
};

const countries = {
  "North Africa": ["Algeria", "Egypt", "Libya", "Morocco", "Tunisia"],
  "West Africa": ["Benin", "Burkina Faso", "Côte d'Ivoire", "Ghana", "Guinea", "Liberia", "Mali", "Niger", "Nigeria", "Senegal"],
  "East Africa": ["Ethiopia", "Kenya", "Rwanda", "Somalia", "Tanzania", "Uganda"],
  "Central Africa": ["Cameroon", "Central African Republic", "Chad", "Democratic Republic of the Congo", "Republic of the Congo"],
  "Southern Africa": ["Angola", "Botswana", "Lesotho", "Malawi", "Mozambique", "Namibia", "South Africa", "Zambia", "Zimbabwe"],
  // Add more countries for other regions as needed
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

const EventForm = () => {
  // State for the date popover
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  
  // Handle popover open state change
  const handlePopoverOpenChange = (open: boolean) => {
    setDatePopoverOpen(open);
  };

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
      price: 0,
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
  const selectedRegion = form.watch("region");
  const selectedSubRegion = form.watch("subRegion");

  async function onSubmit(data: EventFormValues) {
    try {
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
      
      // You might want to reset the form or show a success message
      // form.reset();
    } catch (error) {
      console.error("Failed to create event:", error);
      // Handle error - show error message to user
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
                        <Popover 
                          open={datePopoverOpen}
                          onOpenChange={handlePopoverOpenChange}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDatePopoverOpen(!datePopoverOpen);
                                }}
                              >
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start" onClick={(e) => e.stopPropagation()}>
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  // Create a new date object with the current time
                                  const selectedDate = new Date(date);
                                  const currentTime = field.value || new Date();
                                  selectedDate.setHours(currentTime.getHours());
                                  selectedDate.setMinutes(currentTime.getMinutes());
                                  selectedDate.setSeconds(0);
                                  field.onChange(selectedDate);
                                  // Close the popover after selection
                                  setTimeout(() => setDatePopoverOpen(false), 100);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        
                        {/* Time input */}
                        <div>
                          <Input
                            type="time"
                            value={field.value ? `${field.value.getHours().toString().padStart(2, '0')}:${field.value.getMinutes().toString().padStart(2, '0')}` : "00:00"}
                            onChange={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const newDate = new Date(field.value);
                              newDate.setHours(hours);
                              newDate.setMinutes(minutes);
                              field.onChange(newDate);
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent event bubbling
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
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Paid Event</FormLabel>
                        <FormDescription>Check if this is a paid event</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("isPaid") && (
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
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedRegion}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sub-region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedRegion && subRegions[selectedRegion as keyof typeof subRegions]?.map((subRegion) => (
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSubRegion}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedSubRegion && countries[selectedSubRegion as keyof typeof countries]?.map((country) => (
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
          <Button type="submit" className="w-full md:w-auto">Create Event</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventForm;