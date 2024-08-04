import React, { useState, useEffect } from 'react';
import { UserDataInterface } from '@/types/userData';
import { getUsersByType } from '../../firebase';

interface UserListProps {
  userType: string;
}

const UserList: React.FC<UserListProps> = (props) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<UserDataInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDataInterface[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsersByType(props.userType);
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers); // Initialize filtered users
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [props.userType]);

  useEffect(() => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(lowerCaseSearchText) ||
      user.userType.toLowerCase().includes(lowerCaseSearchText)
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  return (
    <div>
      <div className="space-y-4">
        <input
          type="text"
          className="p-2 text-black bg-white rounded-xl"
          placeholder="Search users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {filteredUsers.length === 0 ? (
          <h1>No users found</h1>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.uid} className="flex flex-row space-x-4">
              <p>{user.name}</p>
              <p>{user.userType}</p>
              {user.isDoc && <p>User Email: {user.docEmail}</p>}
              {user.isPatient && <p>Doctor's Email: {user.docEmail}</p>}
              {user.isPatient && <p>User's Email: {user.patientEmail}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
