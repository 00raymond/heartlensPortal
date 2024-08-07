import React, { useEffect, useState } from 'react';
import { getUserData } from '../../firebase';

interface UserDataModalProps {
  uid: string;
  onClose: () => void;
}

interface UserData {
  data: number[];
  date: string;
  pulse: number;
}

const UserDataModal: React.FC<UserDataModalProps> = ({ uid, onClose }) => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData(uid);
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleDownload = (data: number[]) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Data</h2>
          <button onClick={onClose} className="text-xl font-bold text-red-500 ">x</button>
        </div>
        <div className="space-y-2">
          {userData.map((entry, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-black">{entry.date} - {entry.pulse}</p>
              </div>
              <button
                onClick={() => handleDownload(entry.data)}
                className="bg-blue-500 text-white rounded px-2 py-1"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDataModal;
