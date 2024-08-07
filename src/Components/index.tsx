import React from 'react';
import { useAuth } from  '@/Context/authContext';
const RoleBasedDashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>読み込み中...</div>;
    }

    if (user.roles.includes('admin')) {
        return <AdminDashboard />;
    } else if (user.roles.includes('user')) {
        return <UserDashboard />;
    } else {
        return <GuestDashboard />;
    }
};

const AdminDashboard = () => {
    return (
        <div>
            <h1>管理者ダッシュボード</h1>
            {/* 管理者向けのコンテンツをここに追加 */}
        </div>
    );
};

const UserDashboard = () => {
    return (
        <div>
            <h1>ユーザーダッシュボード</h1>
            {/* 一般ユーザー向けのコンテンツをここに追加 */}
        </div>
    );
};

const GuestDashboard = () => {
    return (
        <div>
            <h1>ゲストダッシュボード</h1>
            {/* ゲストユーザー向けのコンテンツをここに追加 */}
        </div>
    );
};

export default RoleBasedDashboard;
