import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserManagement } from "./UserManagement";
import { ContentManagement } from "./ContentManagement";
import { Users, BookOpen, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';
import React from "react";

interface AdminPageProps {
  currentUser: { username: string; email?: string; role?: string };
  onNavigate?: (view: string) => void;
}

export function AdminPage({ currentUser, onNavigate }: AdminPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("users");

  // Check if user has admin permissions
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg border-2 border-red-500 p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">{t('admin.accessDenied')}</h2>
          <p className="text-gray-600">{t('admin.accessDeniedMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#225d9c] to-[#288f8a] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-3xl">{t('admin.title')}</h1>
          </div>
          <p className="text-white/90">{t('admin.subtitle')}</p>
          <div className="mt-4 inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
            {t('admin.role')}: {currentUser.role === 'admin' ? t('admin.roles.admin') : t('admin.roles.moderator')}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 border-2 border-gray-200">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('admin.userManagement')}
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t('admin.contentManagement')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement currentUser={currentUser} onNavigate={onNavigate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}