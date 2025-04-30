import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Search, Filter, X } from 'lucide-react';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { professionsList } from './admin/PostJob';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const FilterJobs = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: '',
    profession: '',
    jobType: '',
    salary: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    professions: [],
    jobTypes: [],
    salaryRange: { min: 0, max: 0 }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/filters`, {
        withCredentials: true
      });

      if (response.data.success) {
        setFilterOptions(response.data.filters);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (type, value) => {
    const newFilters = {
      ...filters,
      [type]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      location: '',
      profession: '',
      jobType: '',
      salary: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search term as a filter
  const applySearch = () => {
    if (searchTerm.trim()) {
      // Determine if the search term is likely a location or profession
      const isProfession = professionsList.some(p =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (isProfession) {
        handleFilterChange('profession', searchTerm.toLowerCase());
      } else {
        handleFilterChange('location', searchTerm);
      }

      setSearchTerm('');
    }
  };

  // Handle Enter key in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applySearch();
    }
  };

  return (
    <div>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <Button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by profession or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={applySearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {Object.values(filters).some(f => f) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) =>
            value ? (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <span className="capitalize">{key}:</span> {value}
                <button
                  className="ml-1 text-xs"
                  onClick={() => handleFilterChange(key, '')}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null
          )}
          {Object.values(filters).some(f => f) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-6"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Filter sections - hidden on mobile unless toggled */}
      <div className={`bg-white p-5 rounded-lg shadow-sm border border-gray-200 ${!showMobileFilters ? 'hidden md:block' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Filter Jobs</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {/* Location Filter */}
          <AccordionItem value="location">
            <AccordionTrigger className="font-medium">Location</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={filters.location} onValueChange={(val) => handleFilterChange('location', val)}>
                <div className="space-y-1">
                  {filterOptions.locations.map(location => (
                    <div key={location} className="flex items-center space-x-2">
                      <RadioGroupItem value={location} id={`location-${location}`} />
                      <Label htmlFor={`location-${location}`}>{location}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Profession Filter */}
          <AccordionItem value="profession">
            <AccordionTrigger className="font-medium">Profession</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={filters.profession} onValueChange={(val) => handleFilterChange('profession', val)}>
                <div className="space-y-1">
                  {professionsList.map(profession => (
                    <div key={profession} className="flex items-center space-x-2">
                      <RadioGroupItem value={profession.toLowerCase()} id={`profession-${profession}`} />
                      <Label htmlFor={`profession-${profession}`}>{profession}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Job Type Filter */}
          <AccordionItem value="jobType">
            <AccordionTrigger className="font-medium">Job Type</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={filters.jobType} onValueChange={(val) => handleFilterChange('jobType', val)}>
                <div className="space-y-1">
                  {filterOptions.jobTypes.map(jobType => (
                    <div key={jobType} className="flex items-center space-x-2">
                      <RadioGroupItem value={jobType} id={`jobType-${jobType}`} />
                      <Label htmlFor={`jobType-${jobType}`}>{jobType}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Salary Range Filter */}
          <AccordionItem value="salary">
            <AccordionTrigger className="font-medium">Salary Range</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={filters.salary} onValueChange={(val) => handleFilterChange('salary', val)}>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10000" id="salary-10k" />
                    <Label htmlFor="salary-10k">₹10,000+</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="20000" id="salary-20k" />
                    <Label htmlFor="salary-20k">₹20,000+</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30000" id="salary-30k" />
                    <Label htmlFor="salary-30k">₹30,000+</Label>
                  </div>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterJobs;
