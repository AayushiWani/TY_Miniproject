import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { TOOL_API_END_POINT } from '@/utils/constant';
import { 
  Wrench, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  IndianRupee,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
    category: "",
    condition: "good",
    rentalPrice: "",
    rentalUnit: "daily"
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openToolDialog, setOpenToolDialog] = useState(false);
  const [openRentDialog, setOpenRentDialog] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [rentalMessage, setRentalMessage] = useState("");
  
  const conditionColors = {
    new: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800"
  };

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
        const response = await axios.get(TOOL_API_END_POINT);
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
        `${TOOL_API_END_POINT}/create`,
        formData,
        { withCredentials: true }
      );
      toast.success("Tool added successfully!");
      setFormData({
        name: "",
        description: "",
        contactEmail: "",
        category: "",
        condition: "good",
        rentalPrice: "",
        rentalUnit: "daily"
      });
      
      setOpenToolDialog(false);

      // Refresh the tool list
      const toolsResponse = await axios.get(TOOL_API_END_POINT);
      setTools(toolsResponse.data.tools);
    } catch (error) {
      console.error("Error creating tool:", error);
      toast.error(error.response?.data?.message || "Failed to add tool");
    }
  };

  // Handle tool deletion
  const handleDelete = async (toolId) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      try {
        await axios.delete(`${TOOL_API_END_POINT}/${toolId}`, {
          withCredentials: true,
        });
        
        toast.success("Tool deleted successfully");
        // Remove the deleted tool from the state
        setTools(tools.filter((tool) => tool._id !== toolId));
      } catch (error) {
        console.error("Error deleting tool:", error);
        toast.error("Failed to delete tool. You might not have permission.");
      }
    }
  };
  
  // Handle rental request
  const handleRentalRequest = async () => {
    if (!selectedTool) return;
    
    try {
      await axios.post(
        `${TOOL_API_END_POINT}/${selectedTool._id}/rent`,
        { message: rentalMessage },
        { withCredentials: true }
      );
      
      toast.success("Rental request sent!");
      setOpenRentDialog(false);
      setRentalMessage("");
      
      // Refresh the tool list
      const toolsResponse = await axios.get(TOOL_API_END_POINT);
      setTools(toolsResponse.data.tools);
    } catch (error) {
      console.error("Error requesting tool rental:", error);
      toast.error(error.response?.data?.message || "Failed to send rental request");
    }
  };
  
  // Handle responding to rental requests
  const handleRentalResponse = async (toolId, requestId, status) => {
    try {
      await axios.post(
        `${TOOL_API_END_POINT}/rent/respond`,
        { toolId, requestId, status },
        { withCredentials: true }
      );
      
      toast.success(`Rental request ${status}`);
      
      // Refresh the tool list
      const toolsResponse = await axios.get(TOOL_API_END_POINT);
      setTools(toolsResponse.data.tools);
    } catch (error) {
      console.error("Error responding to rental request:", error);
      toast.error(error.response?.data?.message || "Failed to respond to rental request");
    }
  };

  // Check if the current user is the owner of a tool
  const isOwner = (tool) => {
    if (!currentUser || !tool) return false;
    
    return (
      (tool.userId?._id && tool.userId._id === currentUser._id) ||
      (typeof tool.userId === "string" && tool.userId === currentUser._id)
    );
  };
  
  // Check if current user has already sent a rental request
  const hasRequestedRental = (tool) => {
    if (!currentUser || !tool || !tool.rentalRequests) return false;
    
    return tool.rentalRequests.some(
      req => req.requesterId._id === currentUser._id && req.status === 'pending'
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center ">
      <div className="max-w-5xl mx-5 mt-6 p-5 bg-white rounded-lg shadow-md m-6 border-t-4 border-blue-700">
        <div className="md:flex md:flex-row flex-col justify-between items-center  mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tools Exchange Portal</h1>
            <p className="text-gray-600 my-1">Share and request construction tools</p>
          </div>
          <Button 
            onClick={() => setOpenToolDialog(true)}
            className="bg-orange-600 hover:bg-orange-700 font-semibold"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </div>

        {/* List of Tools */}
        <div className="mt-6">
          <div className="bg-blue-50 p-3 rounded-md mb-4 border-l-4 border-blue-600">
            <h2 className="text-xl font-semibold text-blue-700">Available Tools</h2>
            <p className="text-sm text-gray-600">Browse tools available for rent in your area</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">No tools available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="border-l-4 border-blue-600 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-blue-800">{tool.name}</h3>
                      <Badge className={conditionColors[tool.condition] || "bg-gray-100"}>
                        {tool.condition}
                      </Badge>
                    </div>
                    
                    {tool.category && (
                      <Badge variant="outline" className="mb-2">
                        {tool.category}
                      </Badge>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {tool.description || "No description available"}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {tool.rental?.price ? `${tool.rental.price} / ${tool.rental.unit}` : "Free"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(tool.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      {isOwner(tool) ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(tool._id)}
                        >
                          Delete
                        </Button>
                      ) : tool.rental?.available ? (
                        <Button
                          size="sm"
                          disabled={hasRequestedRental(tool)}
                          onClick={() => {
                            setSelectedTool(tool);
                            setOpenRentDialog(true);
                          }}
                          className={hasRequestedRental(tool) ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}
                        >
                          {hasRequestedRental(tool) ? "Request Pending" : "Request Rental"}
                        </Button>
                      ) : (
                        <Button size="sm" disabled className="bg-gray-400">
                          Not Available
                        </Button>
                      )}
                      
                      <a
                        href={`mailto:${tool.contactEmail}`}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
                      >
                        Contact
                      </a>
                    </div>
                    
                    {/* Show rental requests to owner */}
                    {isOwner(tool) && tool.rentalRequests && tool.rentalRequests.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h4 className="font-medium text-sm mb-2">Rental Requests</h4>
                        {tool.rentalRequests.map(req => (
                          <div key={req._id} className="bg-gray-50 p-2 rounded-md mb-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span>{req.requesterId.fullname}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(req.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs mt-1">{req.message}</p>
                            
                            {req.status === 'pending' ? (
                              <div className="flex gap-2 mt-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs py-0 flex items-center border-green-500 text-green-600 hover:bg-green-50"
                                  onClick={() => handleRentalResponse(tool._id, req._id, 'approved')}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs py-0 flex items-center border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() => handleRentalResponse(tool._id, req._id, 'rejected')}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <Badge className={req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {req.status}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Official notice */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-gray-700 text-center">
            <strong>Official Notice:</strong> All tool exchanges through this platform must comply with local regulations. 
            The RojGar platform is not responsible for any damages or injuries resulting from tool misuse.
          </p>
        </div>
      </div>
      
      {/* Add Tool Dialog */}
      <Dialog open={openToolDialog} onOpenChange={setOpenToolDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-blue-700">Add a Tool</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Tool Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Power Tools, Hand Tools"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Condition</label>
                <Select 
                  name="condition" 
                  value={formData.condition}
                  onValueChange={(value) => setFormData({...formData, condition: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your tool..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price (per unit)</label>
                <Input
                  name="rentalPrice"
                  type="number"
                  value={formData.rentalPrice}
                  onChange={handleChange}
                  placeholder="0 for free"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Unit</label>
                <Select 
                  name="rentalUnit" 
                  value={formData.rentalUnit}
                  onValueChange={(value) => setFormData({...formData, rentalUnit: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Contact Email</label>
              <Input
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenToolDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                Add Tool
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Request Rental Dialog */}
      <Dialog open={openRentDialog} onOpenChange={setOpenRentDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-blue-700">Request Tool Rental</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            {selectedTool && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium">{selectedTool.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTool.rental?.price > 0 
                    ? `${selectedTool.rental.price} / ${selectedTool.rental.unit}`
                    : "Free rental"}
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Message to Owner</label>
              <Textarea
                value={rentalMessage}
                onChange={(e) => setRentalMessage(e.target.value)}
                placeholder="Explain when and why you need this tool..."
                className="mt-1"
                rows={4}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenRentDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleRentalRequest}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Send Request
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ToolsPage;
