import { useEffect, useState } from "react";
import axios from "axios";

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/profile",
          { withCredentials: true }
        );
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Even if there's an error, we should stop loading
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/v1/tool");
        console.log("Fetched tools:", response.data.tools);
        setTools(response.data.tools);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tools:", error);
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/tool/create",
        formData,
        { withCredentials: true }
      );
      alert("Tool request submitted!");
      setFormData({ name: "", description: "", contactEmail: "" }); // Reset form after submission

      // Refresh the tool list
      const toolsResponse = await axios.get(
        "http://localhost:8000/api/v1/tool"
      );
      setTools(toolsResponse.data.tools);
    } catch (error) {
      console.error("Error creating tool request:", error);
    }
  };

  // Handle tool deletion
  const handleDelete = async (toolId) => {
    if (window.confirm("Are you sure you want to delete this tool request?")) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/tool/${toolId}`, {
          withCredentials: true,
        });
        // Remove the deleted tool from the state
        setTools(tools.filter((tool) => tool._id !== toolId));
      } catch (error) {
        console.error("Error deleting tool:", error);
        alert("Failed to delete tool. You might not have permission.");
      }
    }
  };

  // Check if the current user is the owner of a tool
  const isOwner = (tool) => {
    if (!currentUser || !tool) return false;

    // Debug logging to help diagnose the issue
    console.log("Current user ID:", currentUser._id);
    console.log("Tool user ID:", tool.userId?._id || tool.userId);

    // Check different possible formats of the userId
    return (
      (tool.userId?._id && tool.userId._id === currentUser._id) ||
      (typeof tool.userId === "string" && tool.userId === currentUser._id)
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-5 bg-gray-200 rounded-lg m-12">
      <h1 className="text-3xl font-bold mb-4">Tools Request System</h1>

      {/* Tool Request Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 bg-white rounded-lg"
      >
        <input
          type="text"
          name="name"
          placeholder="Tool Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-200"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-200"
        ></textarea>
        <input
          type="email"
          name="contactEmail"
          placeholder="Your Email"
          value={formData.contactEmail}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-200"
        />
        <div className="flex items-center justify-center">
          <button type="submit" className="w-64 bg-purple-600 p-2 rounded text-white">
            Request Tool
          </button>
        </div>
      </form>

      {/* List of Requested Tools */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3">RojGar Tools</h2>
        {loading ? (
          <p>Loading...</p>
        ) : tools.length === 0 ? (
          <p>No tools requested yet.</p>
        ) : (
          <ul className="space-y-4">
            {tools.map((tool) => (
              <li
                key={tool._id}
                className="flex justify-between items-center p-4 bg-white rounded-lg"
              >
                <div>
                  <h3 className="text-xl font-semibold">{tool.name}</h3>
                  <p className="text-sm text-gray-400">
                    {tool.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Contact: {tool.contactEmail}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`mailto:${tool.contactEmail}`}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
                  >
                    Contact
                  </a>
                  {currentUser && (
                    <button
                      onClick={() => handleDelete(tool._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm"
                      title={
                        isOwner(tool)
                          ? "Delete this tool"
                          : "Only the creator can delete this tool"
                      }
                      disabled={!isOwner(tool)}
                      style={{
                        opacity: isOwner(tool) ? 1 : 0.5,
                        cursor: isOwner(tool) ? "pointer" : "not-allowed",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;
