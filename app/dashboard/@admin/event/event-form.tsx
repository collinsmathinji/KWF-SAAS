import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem,FormDescription, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEvent, EventData } from "@/lib/event";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {CalendarDays,} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const eventFormSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters"),
  startDate: z.date(),
  isPaid: z.boolean(),
  price: z.number().optional(),
  duration: z.number().min(1, "Duration must be at least 1 day"),
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
});


type EventFormValues = z.infer<typeof eventFormSchema>;

const EventForm = () => {
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
      },
    })
    async  function onSubmit(data: EventData) {
        try {
          // Convert duration to a number
          const eventData = {
            ...data,
            duration: Number(data.duration), // Ensure duration is a number
          };
      
          const response = await createEvent(eventData);
          console.log("Event created successfully:", response);
        } catch (error) {
          console.error("Failed to create event:", error);
        }
      } 

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Women in Tech Bootcamp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {field.value ? 
                        
                        
                        
                        
                        
                        (field.value, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
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
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    min="1"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number here
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
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-4">
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="West Africa" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Savannah Belt" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Ghana" {...field} />
                </FormControl>
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
                  <Textarea placeholder="Enter event description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button type="submit">Create Event</Button>
      </DialogFooter>
    </form>
  </Form>
  );
};

export default EventForm;