import React from 'react';
import { Role } from '../types/authinfo';

interface RoleBasedContentProps {
  userRoles: Role[];
}
export const RoleBasedContent: React.FC<RoleBasedContentProps> = ({ userRoles }) => {
    const hasRole = (role: Role) => userRoles.includes(role);
  
    return (
      <div>
        {hasRole('admin') && (
          <div>
            <h2>Admin Content</h2>
            <p>This content is only visible to admins.</p>
            <button>Manage Users</button>
            <button>View System Logs</button>
          </div>
        )}
        {hasRole('user') && (
          <div>
            <h2>User Content</h2>
            <p>This content is visible to regular users.</p>
            <button>View Profile</button>
            <button>Edit Settings</button>
          </div>
        )}
        {hasRole('guest') && (
          <div>
            <h2>Guest Content</h2>
            <p>This content is visible to guests.</p>
            <button>Upgrade Account</button>
            <button>Take a Tour</button>
          </div>
        )}
        {userRoles.length === 0 && (
          <div>
            <h2>No Role Assigned</h2>
            <p>Please contact an administrator to assign you a role.</p>
          </div>
        )}
      </div>
    );
  };
