'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, FileText, Hash, Search, Settings, Users, Database, Download } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();

  const adminModules = [
    {
      title: t('admin.translations'),
      description: t('admin.translations_desc'),
      href: '/admin/translations',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: t('admin.tafseer'),
      description: t('admin.tafseer_desc'),
      href: '/admin/tafseer',
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: t('admin.morphology'),
      description: t('admin.morphology_desc'),
      href: '/admin/morphology',
      icon: Hash,
      color: 'bg-purple-500',
    },
    {
      title: t('admin.search'),
      description: t('admin.search_desc'),
      href: '/admin/search',
      icon: Search,
      color: 'bg-orange-500',
    },
  ];

  const adminActions = [
    {
      title: t('admin.users'),
      description: t('admin.users_desc'),
      href: '/admin/users',
      icon: Users,
      color: 'bg-red-500',
    },
    {
      title: t('admin.settings'),
      description: t('admin.settings_desc'),
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-gray-500',
    },
    {
      title: t('admin.database'),
      description: t('admin.database_desc'),
      href: '/admin/database',
      icon: Database,
      color: 'bg-indigo-500',
    },
    {
      title: t('admin.export'),
      description: t('admin.export_desc'),
      href: '/admin/export',
      icon: Download,
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4 font-arabic">
            {t('admin.title')}
          </h1>
          <p className="text-lg text-amber-700">
            {t('admin.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('admin.total_translations')}</p>
                <p className="text-2xl font-bold text-gray-900">45,850</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('admin.total_tafseer')}</p>
                <p className="text-2xl font-bold text-gray-900">6,236</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Hash className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('admin.total_morphology')}</p>
                <p className="text-2xl font-bold text-gray-900">89,442</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('admin.active_users')}</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Management Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            {t('admin.content_management')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminModules.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.href} className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-amber-200">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${module.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {module.description}
                  </p>
                  <Link href={module.href}>
                    <Button className="w-full" size="sm">
                      {t('common.manage')}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Admin Actions */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            {t('admin.system_management')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.href} className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-amber-200">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <Link href={action.href}>
                    <Button className="w-full" size="sm" variant="outline">
                      {t('common.manage')}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}