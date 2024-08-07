import React from 'react';
import { useAuth } from  '@/Context/authContext';
import { RoleBasedContent } from '@/components/RoleBasedContent';

export const RoleBasedDashboard = () => {
    const { user, logout } = useAuth();

    if (!user) return null; // or some loading state
  
    return (
      <div>
        <h1>Welcome, {user.name}</h1>
        <p>Your roles are: {user.roles.join(', ')}</p>
        <RoleBasedContent userRoles={user.roles} />
        <button onClick={logout}>Logout</button>
      </div>
    );
};