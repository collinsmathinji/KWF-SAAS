import { useState } from "react";
import { Plus, toast } from "lucide-react";
import { createGroupType } from "@/lib/group";

const GroupTypeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    behavior: "", // Added behavior field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the data to send to the API
      const groupTypeData = {
        name: formData.name,
        description: formData.description,
        behavior: formData.behavior, // Include behavior in the payload
      };

      // Call the createGroupType function
      const response = await createGroupType(groupTypeData);

      console.log("Group type created successfully:", response);
      setSuccessMessage("Group type created successfully!");
      setFormData({
        name: "",
        description: "",
        behavior: "",
      });
    } catch (error) {
      console.error("Error creating group type:", error);
      toast({
        title: "Error",
        description: "Failed to create group type. Please try again.",
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
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Create Group Type</h2>
        <p className="text-blue-600 text-sm">Add a new type of group to the system</p>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-2" htmlFor="typeName">
            Type Name*
          </label>
          <input
            type="text"
            id="typeName"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group type name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-2" htmlFor="typeBehavior">
            Behavior*
          </label>
          <select
            id="typeBehavior"
            name="behavior"
            value={formData.behavior}
            onChange={handleInputChange}
            className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select behavior</option>
            <option value="private">Private</option>
            <option value="public_open">Public Open</option>
            <option value="public_closed">Public Closed</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-blue-800 font-medium mb-2" htmlFor="typeDescription">
            Description
          </label>
          <textarea
            id="typeDescription"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe this group type"
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
                <Plus size={18} className="mr-2" />
                Create Group Type
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupTypeForm;