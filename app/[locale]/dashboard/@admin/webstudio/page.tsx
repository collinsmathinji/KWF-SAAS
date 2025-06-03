"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout, Code, Eye, Save, Plus, Globe } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Define proper types for organization details
interface OrganizationDetails {
  id: string;
  name: string;
  domain?: string;
  [key: string]: any;
}

interface Project {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  url?: string;
}

const defaultTemplates = [
  {
    id: 'business',
    name: 'Business Website',
    description: 'Professional business template',
    html: `
      <header class="bg-white shadow-sm">
        <nav class="container mx-auto px-4 py-4">
          <h1 class="text-xl font-bold text-gray-800">Your Business</h1>
        </nav>
      </header>
      <main class="container mx-auto px-4 py-8">
        <section class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Business</h2>
          <p class="text-xl text-gray-600">We provide the best solutions for your needs</p>
        </section>
      </main>
    `,
    css: `
      .container { max-width: 1200px; margin: 0 auto; }
      .text-center { text-align: center; }
      .mb-4 { margin-bottom: 1rem; }
    `
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work',
    html: `
      <header class="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <div class="container mx-auto px-4 py-16">
          <h1 class="text-4xl font-bold">Your Name</h1>
          <p class="text-xl mt-4">Creative Professional</p>
        </div>
      </header>
      <main class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded shadow">Project 1</div>
          <div class="bg-white p-4 rounded shadow">Project 2</div>
        </div>
      </main>
    `,
    css: `
      .container { max-width: 1200px; margin: 0 auto; }
      .grid { display: grid; }
      .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
      .gap-4 { gap: 1rem; }
    `
  }
];

export default function WebStudioPage({ params }: { params: { locale: string } }) {
  const [currentView, setCurrentView] = useState<'edit' | 'preview'>('edit')
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [editingHtml, setEditingHtml] = useState('')
  const [editingCss, setEditingCss] = useState('')
  const [organizationDetails, setOrganizationDetails] = useState<OrganizationDetails | null>(null)

  const createNewProject = (template?: typeof defaultTemplates[0]) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: template ? `New ${template.name}` : 'New Website',
      description: template ? template.description : 'A new website project',
      html: template ? template.html : '<h1>Welcome to your new website</h1>',
      css: template ? template.css : 'h1 { color: blue; }',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setEditingHtml(newProject.html);
    setEditingCss(newProject.css);
  };

  const saveProject = () => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      html: editingHtml,
      css: editingCss,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const publishProject = () => {
    if (!currentProject || !organizationDetails?.domain) return;

    const updatedProject = {
      ...currentProject,
      published: true,
      url: `https://${organizationDetails.domain}/${currentProject.id}`,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Website Builder</CardTitle>
            <CardDescription>
              Create and manage your organization's website
            </CardDescription>
          </div>
          {currentProject && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView(currentView === 'edit' ? 'preview' : 'edit')}
              >
                {currentView === 'edit' ? <Eye className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
                {currentView === 'edit' ? 'Preview' : 'Edit'}
              </Button>
              <Button onClick={saveProject}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={publishProject} variant="default">
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      {!currentProject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => createNewProject()}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Blank Project
              </CardTitle>
              <CardDescription>Start from scratch</CardDescription>
            </CardHeader>
          </Card>
          {defaultTemplates.map(template => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => createNewProject(template)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  {template.name}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">HTML</label>
                  <Textarea
                    value={editingHtml}
                    onChange={(e) => setEditingHtml(e.target.value)}
                    className="font-mono h-[400px]"
                    placeholder="Enter your HTML here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CSS</label>
                  <Textarea
                    value={editingCss}
                    onChange={(e) => setEditingCss(e.target.value)}
                    className="font-mono h-[400px]"
                    placeholder="Enter your CSS here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {currentView === 'preview' && (
            <Card>
              <CardContent className="p-0">
                <iframe
                  srcDoc={`
                    <style>${editingCss}</style>
                    ${editingHtml}
                  `}
                  className="w-full h-[600px] border-0"
                  title="Preview"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {projects.length > 0 && !currentProject && (
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setCurrentProject(project);
                    setEditingHtml(project.html);
                    setEditingCss(project.css);
                  }}
                >
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {project.published && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        View Live
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}