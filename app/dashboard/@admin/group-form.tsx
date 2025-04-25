import { useState } from "react";
import { 
  Save, 
  Upload, 
  Plus,
  Info
} from "lucide-react";
import { uploadOrganizationLogo } from "@/lib/organization";
import { createGroup } from "@/lib/group";
import { toast } from "@/hooks/use-toast";
import { group } from "console";
// Add this at the top of the file
interface GroupFormProps {
    groupTypes: Array<{
      id: number;
      name: string;
      members?: number;
    }>;
  }
const GroupForm = ({ groupTypes }: GroupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    logo: undefined,
    logoPreview: "",
    organizationId: "",
    groupTypeId: "",
    description: ""
  });
  const organizationId = localStorage.getItem("organizationId") || "1"; // Default to 1 if not found
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sample data for select options
  const organizations = [
    { id: "org1", name: "Organization One" },
    { id: "org2", name: "Organization Two" },
    { id: "org3", name: "Organization Three" }
  ];
  

  console.log("Group Types202:", groupTypes);   

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setFormData({
      ...formData,
      logoPreview: URL.createObjectURL(file),
    });
  
    try {
      // Assuming `uploadOrganizationLogo` is a function available for uploading
      const uploadedUrl = await uploadOrganizationLogo(file);
      console.log("Uploaded URL:", uploadedUrl);
  
      setFormData((prevData:any) => ({
        ...prevData,
        logo: uploadedUrl, // Store the uploaded URL instead of the file
      }));
    } catch (err) {
      console.error("Upload failed:", err);
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Prepare the data to send to the API
      const groupData = {
        name: formData.name,
        logo: formData.logo, // This should already be the uploaded URL
        description: formData.description,
        organizationId: organizationId
        // groupTypeId: parseInt(formData.groupTypeId, 10),
      };
  
      // Call the createGroup function
      const response = await createGroup(groupData);
  
      console.log("Group created successfully:", response);
      setSuccessMessage("Group created successfully!");
      setFormData({
        name: "",
        logo: undefined,
        logoPreview: "",
        organizationId: "",
        groupTypeId: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
  
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Create New Group</h2>
        <p className="text-blue-600 text-sm">Fill out the form below to create a new group</p>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-2" htmlFor="name">
            Group Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-2" htmlFor="logo">
            Group Logo
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {formData.logoPreview ? (
                <img 
                  src={formData.logoPreview} 
                  alt="Logo Preview" 
                  className="h-16 w-16 object-cover rounded-md border border-blue-300"
                />
              ) : (
                <div className="h-16 w-16 bg-blue-50 flex items-center justify-center rounded-md border border-blue-300">
                  <Info className="text-blue-300" size={24} />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <label className="flex items-center justify-center w-full p-2 border border-blue-300 rounded-md bg-blue-50 hover:bg-blue-100 cursor-pointer">
                <Upload size={18} className="mr-2 text-blue-600" />
                <span className="text-blue-700">Upload Logo</span>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleLogoChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <p className="text-xs text-blue-600 mt-1">Recommended size: 512x512px</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          <div>
            <label className="block text-blue-800 font-medium mb-2" htmlFor="groupTypeId">
              Group Type*
            </label>
            <select
              id="groupTypeId"
              name="groupTypeId"
              value={formData.groupTypeId}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select Group Type</option>
              {groupTypes.map((type:any) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-blue-800 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the purpose of this group"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Create Group
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default GroupForm;