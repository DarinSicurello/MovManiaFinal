import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ProfilesPage.css';

interface Profile {
  id: string;
  name: string;
  email: string;
  title: string;
  titleDescription: string;
  bio: string;
  avatarUrl: string;
}

export default function ProfilesPage() {
  // Set new profile form 
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // All profiles from JSON server Local React Server db.json
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // State to hold new profile data - 3.7 new data Removed ID 
  const [newProfile, setNewProfile] = useState<Omit<Profile, 'id'>>({
    name: '',
    email: '',
    title: '',
    titleDescription: '',
    bio: '',
    avatarUrl: ''
  });

  // Get profileId from URL params (react-router)
  const { profileId } = useParams<{ profileId?: string }>();
  const navigate = useNavigate();

  // Load profiles from JSON file via API (db.json)
  useEffect(() => {
    fetch('http://localhost:3002/profiles')
      .then(res => res.json())
      .then((data: Profile[]) => setProfiles(data))
      .catch(err => console.error('Failed to fetch profiles:', err));
  }, []);

  // Redirect to first profile if on /profiles and one exists
  useEffect(() => {
    if (!profileId && profiles.length > 0) {
      navigate(`profile/${profiles[0].id}`, { replace: true });
    }
  }, [profileId, profiles, navigate]);

  // Handle input changes in the profile form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({ ...prev, [name]: value }));
  };

  // Save new profile or update existing one
  const handleSave = () => {
    if (isEditing && editId) {
      // PUT update existing profile
      fetch(`http://localhost:3002/profiles/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProfile, id: editId }),
      })
        .then(res => res.json())
        .then((updated: Profile) => {
          setProfiles(prev => prev.map(p => (p.id === editId ? updated : p)));
          resetForm();
        })
        .catch(err => console.error('Failed to update profile:', err));
    } else {
      // POST new profile
      fetch('http://localhost:3002/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      })
        .then(res => res.json())
        .then((data: Profile) => {
          setProfiles(prev => [...prev, data]);
          resetForm();
        })
        .catch(err => console.error('Failed to save profile:', err));
    }
  };

  // Edit a profile load data into form)
  const handleEdit = (profile: Profile) => {
    setNewProfile({
      name: profile.name,
      email: profile.email,
      title: profile.title,
      titleDescription: profile.titleDescription,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl
    });
    setEditId(profile.id);
    setIsEditing(true);
    setShowForm(true);
  };

  // Delete a profile UPDATED
  const handleDelete = (id: string) => {
    fetch(`http://localhost:3002/profiles/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProfiles(prev => prev.filter(p => p.id !== id));
        if (editId === id) resetForm();
        if (profileId === id) navigate('/profiles');
      })
      .catch(err => console.error('Failed to delete profile:', err));
  };

  // Reset form to initial state UDPATED
  const resetForm = () => {
    setNewProfile({
      name: '',
      email: '',
      title: '',
      titleDescription: '',
      bio: '',
      avatarUrl: ''
    });
    setEditId(null);
    setIsEditing(false);
    setShowForm(false);
  };

  // Find profile to edit UPDATED)
  const profileToEdit = profileId ? profiles.find(p => p.id === profileId) : undefined;

  return (
    <div className="profiles-page-wrapper">
      {/* Updated Main flex container with left (list) and right (form/outlet) */}
      <div className="main-con">
        {/* Left section: profile list */}
        <div className="left-section">
          <h2>Profiles</h2>
          <ul className="nav flex-column">
            {profiles.map((profile) => (
              <li className="nav-item mb-2" key={profile.id}>
                <Link className="nav-link" to={`profile/${profile.id}`}>
                  {profile.name}
                </Link>
              </li>
            ))}
            {/* New Profile button for boostrap UPDATED */}
            <li className="nav-item mt-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                New Profile
              </button>
            </li>
          </ul>
        </div>

        {/* Right section: form or Outlet for profile view */}
        <div className="right-section">
          {showForm ? (
            <div className="p-3 border rounded bg-light mb-4">
              <h3>{isEditing ? 'Edit Profile' : 'Create New Profile'}</h3>
              {/* Form Inputs */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newProfile.name}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newProfile.email}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newProfile.title}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="titleDescription"
                placeholder="Title Description"
                value={newProfile.titleDescription}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <textarea
                name="bio"
                placeholder="Bio"
                value={newProfile.bio}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="avatarUrl"
                placeholder="Avatar URL"
                value={newProfile.avatarUrl}
                onChange={handleChange}
                className="form-control mb-2"
              />
              {/* Form Buttons */}
              <button className="btn btn-success me-2" onClick={handleSave}>
                {isEditing ? 'Update Profile' : 'Save Profile'}
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* Outlet to render profile detail view */}
              <Outlet />

              {/* Edit/Delete only when a profile is selected */}
              {profileId && profileToEdit && (
                <div className="mt-3">
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handleEdit(profileToEdit)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(profileId)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
