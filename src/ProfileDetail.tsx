import { useParams } from 'react-router-dom'; 
import { useEffect, useState } from 'react';
import './ProfileDetail.css';

export default function ProfileDetail() {
  const { profileId } = useParams<{ profileId: string }>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!profileId) return;

    fetch(`http://localhost:3002/profiles/${profileId}`) // <-- changed port to 3002
      .then(res => {
        if (!res.ok) {
          throw new Error('Profile not found');
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => {
        console.error('Failed to load profile data:', err);
      });
  }, [profileId]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }
     // Profile details form data Tyepsript 
  return (
    <div className="profile-detail">
      <div className="avatar-container">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="avatar-image" />
        ) : (
          <div className="avatar-fallback">{getInitials(user.name)}</div>
        )}
      </div>

      <h2>{user.name}</h2>
      
      <p>Viewing profile with ID: {profileId}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Title:</strong> {user.title}</p>
      <p><strong>Description:</strong> {user.titleDescription}</p>
      <p><strong>Bio:</strong> {user.bio}</p>
    </div>
  );
}
