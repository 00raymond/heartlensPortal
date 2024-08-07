import React, { useState, useEffect } from 'react';
import { UserDataInterface } from '@/types/userData';
import { getUsersByType, toggleUserActivity } from '../../firebase';
import UserDataModal from './UserDataModal';

interface UserListProps {
  userType: string;
}

const UserList: React.FC<UserListProps> = ({ userType }) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<UserDataInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDataInterface[]>([]);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [disabledUsers, setDisabledUsers] = useState<Set<string>>(new Set());
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsersByType(userType);
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers); // Initialize filtered users
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [userType]);

  useEffect(() => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(lowerCaseSearchText) ||
      user.userType.toLowerCase().includes(lowerCaseSearchText)
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const handleToggleActivity = (uid: string) => {
    toggleUserActivity(uid);
    setDisabledUsers((prevDisabledUsers) => {
      const newDisabledUsers = new Set(prevDisabledUsers);
      if (newDisabledUsers.has(uid)) {
        newDisabledUsers.delete(uid);
      } else {
        newDisabledUsers.add(uid);
      }
      return newDisabledUsers;
    });
  };

  const handleOpenModal = (uid: string) => {
    setSelectedUserId(uid);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

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
            <div
              key={user.uid}
              className="flex flex-row space-x-4 bg-white bg-opacity-20 p-2 rounded-xl relative"
              onMouseEnter={() => setHoveredUserId(user.uid)}
              onMouseLeave={() => setHoveredUserId(null)}
            >
              <p>{user.name}</p>
              {user.isDoc && <p>Email: {user.email}</p>}
              {user.isPatient && <p>Doctor's Email: {user.parentEmail} </p>}
              {user.isPatient && <p>Patient's Email: {user.email}</p>}
              {hoveredUserId === user.uid && (
                <div className="flex flex-col">
                  <span
                    className="bg-white bg-opacity-25 rounded-xl absolute top-0 right-0 p-0.5 cursor-pointer"
                    onClick={() => handleToggleActivity(user.uid)}
                  >
                    {disabledUsers.has(user.uid) ? '🚩' : '🏳️'}
                  </span>
                  <span
                    className="bg-white bg-opacity-25 rounded-xl absolute top-0 right-8 p-2 cursor-pointer"
                    onClick={() => handleOpenModal(user.uid)}
                  >
                    View
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {selectedUserId && <UserDataModal uid={selectedUserId} onClose={handleCloseModal} />}
    </div>
  );
};

export default UserList;
