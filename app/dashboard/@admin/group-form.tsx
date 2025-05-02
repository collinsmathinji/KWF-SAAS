import { useState, useEffect } from "react";
import { 
  Save, 
  Upload, 
  Info,
  X
} from "lucide-react";
import { uploadOrganizationLogo } from "@/lib/organization";
import { createGroup } from "@/lib/group";
import { toast } from "@/hooks/use-toast";
import { signOut, useSession } from "next-auth/react";

// Define proper TypeScript interfaces
interface GroupFormProps {
  onClose?: () => void;
}

interface FormData {
  name: string;
  logo?: string;
  logoPreview: string;
  description: string;
  organizationId?: string;
  groupType: string;
}

const GroupForm = ({ onClose }: GroupFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    logoPreview: "",
    description: "",
    groupType: ""
  });
  
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Set organization ID from session when it's available
  useEffect(() => {
    if (session?.user?.organizationId) {
      setFormData(prev => ({
        ...prev,
        organizationId: session.user.organizationId
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const uploadedUrl = await uploadOrganizationLogo(file);
      console.log("Uploaded URL:", uploadedUrl);
  
      setFormData(prevData => ({
        ...prevData,
        logo: uploadedUrl,
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Ensure organizationId is available
      if (!formData.organizationId && session?.user?.organizationId) {
        setFormData(prev => ({
          ...prev,
          organizationId: session.user.organizationId
        }));
      }
      
      // Double-check organizationId before submission
      if (!formData.organizationId) {
        throw new Error("Organization ID is required");
      }
      
      // Prepare the data to send to the API
      const groupData = {
        name: formData.name,
        logo: formData.logo,
        description: formData.description,
        organizationId: formData.organizationId,
        groupTypeId: formData.groupType
      };
      
      console.log("Submitting group data:", groupData);
      
      // Call the createGroup function
      const response = await createGroup(groupData);
  
      console.log("Group created successfully:", response);
      setSuccessMessage("Group created successfully!");
      
      // Clear form data and close after successful creation
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-blue-600 mb-1">Create Group</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600">Create New Group</h3>
          <p className="text-sm text-blue-500">Fill out the form below to create a new group</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-blue-800 font-medium mb-2" htmlFor="name">
              Group Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-blue-800 font-medium mb-2" htmlFor="logo">
              Group Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex-shrink-0 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-center">
                {formData.logoPreview ? (
                  <img 
                    src={formData.logoPreview} 
                    alt="Logo Preview" 
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <Info className="text-blue-300" size={20} />
                )}
              </div>
              <div className="flex-grow">
                <button 
                  type="button" 
                  onClick={() => document.getElementById('logoUpload')?.click()}
                  className="flex items-center justify-center w-full p-2 border border-blue-200 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Upload size={16} className="mr-2 text-blue-600" />
                  <span className="text-blue-700">Upload Logo</span>
                </button>
                <input
                  type="file"
                  id="logoUpload"
                  name="logo"
                  onChange={handleLogoChange}
                  className="hidden"
                  accept="image/*"
                />
                <p className="text-xs text-blue-600 mt-1">Recommended size: 512×512px</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-blue-800 font-medium mb-2" htmlFor="groupType">
              Group Type*
            </label>
            <select
              id="groupType"
              name="groupType"
              value={formData.groupType}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select behavior</option>
              <option value="private">Private</option>
              <option value="public_open">Public Open</option>
              <option value="public_closed">Public Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-blue-800 font-medium mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the purpose of this group"
            ></textarea>
          </div>

          {/* Debug information - remove in production */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
            Current Organization ID: {formData.organizationId || "Not set"}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Create Group
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;