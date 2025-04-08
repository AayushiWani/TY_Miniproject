import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setGroups, setLoading, setError } from '../redux/groupSlice';
import { GROUP_API_END_POINT } from '../utils/constant';

const useGroups = (profession = null) => {
  const dispatch = useDispatch();
  const { groups } = useSelector(state => state.group);
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        dispatch(setLoading(true));
        
        let url = `${GROUP_API_END_POINT}/all`;
        // Only add profession parameter if it's provided and not null
        if (profession) {
          url += `?profession=${profession}`;
        }
        
        const response = await axios.get(url);
        
        if (response.data.success) {
          dispatch(setGroups(response.data.groups));
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch groups'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    fetchGroups();
  }, [dispatch, profession]);
  
  return groups;
};

export default useGroups;
