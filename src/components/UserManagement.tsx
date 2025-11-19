import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Search, BarChart3, Shield, Ban, CheckCircle, Eye } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'inactive';
  joinDate: string;
  lessonsCompleted: number;
  studyStreak: number;
  avgScore: number;
}

interface UserManagementProps {
  currentUser: { username: string; email?: string; role?: string };
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  // Load users from localStorage or create mock data
  useEffect(() => {
    const storedUsers = localStorage.getItem('adminUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with mock data
      const mockUsers: User[] = [
        {
          id: '1',
          username: currentUser.username,
          email: currentUser.email || 'admin@tvenglish.com',
          role: 'admin',
          status: 'active',
          joinDate: new Date().toISOString(),
          lessonsCompleted: 45,
          studyStreak: 12,
          avgScore: 85
        },
        {
          id: '2',
          username: 'john_doe',
          email: 'john@example.com',
          role: 'user',
          status: 'active',
          joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lessonsCompleted: 23,
          studyStreak: 5,
          avgScore: 78
        },
        {
          id: '3',
          username: 'jane_smith',
          email: 'jane@example.com',
          role: 'moderator',
          status: 'active',
          joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          lessonsCompleted: 67,
          studyStreak: 21,
          avgScore: 92
        },
        {
          id: '4',
          username: 'bob_wilson',
          email: 'bob@example.com',
          role: 'user',
          status: 'inactive',
          joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          lessonsCompleted: 12,
          studyStreak: 0,
          avgScore: 65
        }
      ];
      setUsers(mockUsers);
      localStorage.setItem('adminUsers', JSON.stringify(mockUsers));
    }
  }, [currentUser]);

  // Save users to localStorage whenever they change
  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus: 'active' | 'inactive' = user.status === 'active' ? 'inactive' : 'active';
        toast.success(
          newStatus === 'active'
            ? t('admin.users.activated', { username: user.username })
            : t('admin.users.deactivated', { username: user.username })
        );
        return { ...user, status: newStatus };
      }
      return user;
    });
    saveUsers(updatedUsers);
  };

  // Change user role
  const changeUserRole = (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    if (currentUser.role !== 'admin') {
      toast.error(t('admin.users.onlyAdminCanChangeRoles'));
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        toast.success(t('admin.users.roleChanged', { username: user.username, role: t(`admin.roles.${newRole}`) }));
        return { ...user, role: newRole };
      }
      return user;
    });
    saveUsers(updatedUsers);
    setShowRoleDialog(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-300';
      case 'moderator': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6 border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('admin.users.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder={t('admin.users.filterByRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.users.allRoles')}</SelectItem>
              <SelectItem value="user">{t('admin.roles.user')}</SelectItem>
              <SelectItem value="moderator">{t('admin.roles.moderator')}</SelectItem>
              <SelectItem value="admin">{t('admin.roles.admin')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder={t('admin.users.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.users.allStatuses')}</SelectItem>
              <SelectItem value="active">{t('admin.users.active')}</SelectItem>
              <SelectItem value="inactive">{t('admin.users.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* User Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-2 border-[#225d9c]">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.totalUsers')}</div>
          <div className="text-3xl">{users.length}</div>
        </Card>
        <Card className="p-6 border-2 border-green-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.activeUsers')}</div>
          <div className="text-3xl text-green-600">{users.filter(u => u.status === 'active').length}</div>
        </Card>
        <Card className="p-6 border-2 border-purple-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.moderators')}</div>
          <div className="text-3xl text-purple-600">{users.filter(u => u.role === 'moderator').length}</div>
        </Card>
        <Card className="p-6 border-2 border-red-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.admins')}</div>
          <div className="text-3xl text-red-600">{users.filter(u => u.role === 'admin').length}</div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.username')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.email')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.progress')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#225d9c] text-white flex items-center justify-center mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-900">{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`border ${getRoleBadgeColor(user.role)}`}>
                      {t(`admin.roles.${user.role}`)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`border ${getStatusBadgeColor(user.status)}`}>
                      {t(`admin.users.${user.status}`)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.lessonsCompleted} {t('admin.users.lessons')} • {user.studyStreak} {t('admin.users.dayStreak')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowStatsDialog(true);
                        }}
                        className="border-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleDialog(true);
                        }}
                        disabled={currentUser.role !== 'admin'}
                        className="border-2"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                        className="border-2"
                      >
                        {user.status === 'active' ? (
                          <Ban className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Statistics Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="border-2 border-[#225d9c]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#225d9c]" />
              {t('admin.users.learningStats')}: {selectedUser?.username}
            </DialogTitle>
            <DialogDescription>
              {t('admin.users.statsDescription')}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.lessonsCompleted')}</div>
                  <div className="text-2xl">{selectedUser.lessonsCompleted}</div>
                </Card>
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.studyStreak')}</div>
                  <div className="text-2xl">{selectedUser.studyStreak} {t('admin.users.days')}</div>
                </Card>
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.avgScore')}</div>
                  <div className="text-2xl">{selectedUser.avgScore}%</div>
                </Card>
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.joinDate')}</div>
                  <div className="text-sm">{new Date(selectedUser.joinDate).toLocaleDateString()}</div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="border-2 border-[#225d9c]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#225d9c]" />
              {t('admin.users.changeRole')}: {selectedUser?.username}
            </DialogTitle>
            <DialogDescription>
              {t('admin.users.changeRoleDescription')}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {t('admin.users.currentRole')}: <Badge className={`border ${getRoleBadgeColor(selectedUser.role)}`}>
                  {t(`admin.roles.${selectedUser.role}`)}
                </Badge>
              </div>
              <Select
                defaultValue={selectedUser.role}
                onValueChange={(value: 'user' | 'moderator' | 'admin') => {
                  changeUserRole(selectedUser.id, value);
                }}
              >
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t('admin.roles.user')}</SelectItem>
                  <SelectItem value="moderator">{t('admin.roles.moderator')}</SelectItem>
                  <SelectItem value="admin">{t('admin.roles.admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)} className="border-2">
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
