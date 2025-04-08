import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import GroupCard from './GroupCard';
import CreateGroupDialog from './CreateGroupDialog';
import useGroups from '@/hooks/useGroups';
import { Plus, Search } from 'lucide-react';

const GroupDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all'); // Change default value to 'all' instead of empty string
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { professions, loading } = useSelector(state => state.group);
  // Only filter by profession if it's not 'all'
  const groups = useGroups(selectedProfession === 'all' ? null : selectedProfession);
  
  // Filter groups by search term
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Group Directory</h1>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select 
            value={selectedProfession} 
            onValueChange={setSelectedProfession}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Professions" />
            </SelectTrigger>
            <SelectContent>
              {/* Replace empty string with 'all' */}
              <SelectItem value="all">All Professions</SelectItem>
              {professions.map(profession => (
                <SelectItem key={profession} value={profession}>
                  {profession}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No groups found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || selectedProfession !== 'all'
                ? "Try adjusting your filters" 
                : "Be the first to create a group!"}
            </p>
          </div>
        )}
      </main>
      
      <Footer />
      
      <CreateGroupDialog 
        open={showCreateDialog} 
        setOpen={setShowCreateDialog} 
      />
    </div>
  );
};

export default GroupDirectory;
