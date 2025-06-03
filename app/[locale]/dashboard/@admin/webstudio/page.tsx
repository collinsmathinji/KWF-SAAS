import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout, Code, Eye, Save, Plus, Globe, Settings, ExternalLink, Download, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WebStudioProps {
  organisationDetails: any;
}

// WebStudio Configuration
const WEBSTUDIO_CONFIG = {
  // Use hosted WebStudio or your self-hosted instance
  hostedUrl: 'https://apps.webstudio.is',
  // For self-hosted, use your domain
  selfHostedUrl: 'https://your-webstudio-instance.com',
  // Use hosted version by default
  useHosted: true
};

// Template configurations for WebStudio
const webstudioTemplates = [
  {
    id: 'business-modern',
    name: 'Modern Business',
    description: 'Clean, professional business website',
    category: 'business',
    previewUrl: '/templates/business-modern-preview.png',
    webstudioId: 'template-business-modern'
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'Showcase your creative work beautifully',
    category: 'portfolio',
    previewUrl: '/templates/portfolio-creative-preview.png',
    webstudioId: 'template-portfolio-creative'
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'Complete online store template',
    category: 'ecommerce',
    previewUrl: '/templates/ecommerce-store-preview.png',
    webstudioId: 'template-ecommerce-store'
  },
  {
    id: 'blog-minimal',
    name: 'Minimal Blog',
    description: 'Clean and simple blog layout',
    category: 'blog',
    previewUrl: '/templates/blog-minimal-preview.png',
    webstudioId: 'template-blog-minimal'
  }
];

interface WebStudioProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deployUrl?: string;
  status: 'draft' | 'published' | 'deploying';
}

export default function WebStudio({ organisationDetails }: WebStudioProps) {
  const [currentView, setCurrentView] = useState<'templates' | 'editor' | 'projects'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [projects, setProjects] = useState<WebStudioProject[]>([])
  const [currentProject, setCurrentProject] = useState<WebStudioProject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const webstudioIframeRef = useRef<HTMLIFrameElement>(null)

  // Initialize WebStudio projects
  useEffect(() => {
    loadUserProjects();
  }, []);

  const loadUserProjects = async () => {
    setIsLoading(true);
    try {
      // Replace with your API endpoint
      const response = await fetch(`/api/webstudio/projects?orgId=${organisationDetails.id}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      // Set mock data for demo
      setProjects([
        {
          id: 'proj-1',
          name: 'Company Website',
          description: 'Main business website',
          createdAt: '2025-01-15',
          updatedAt: '2025-01-20',
          deployUrl: 'https://company.example.com',
          status: 'published'
        },
        {
          id: 'proj-2',
          name: 'Landing Page',
          description: 'Product launch page',
          createdAt: '2025-01-18',
          updatedAt: '2025-01-19',
          status: 'draft'
        }
      ]);
    }
    setIsLoading(false);
  };

  const createNewProject = async (templateId?: string) => {
    setIsLoading(true);
    try {
      const payload = {
        orgId: organisationDetails.id,
        templateId: templateId,
        name: templateId ? `New ${templateId} Site` : 'New Website',
        description: 'Created with WebStudio'
      };

      // Replace with your API endpoint
      const response = await fetch('/api/webstudio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newProject = await response.json();
        setCurrentProject(newProject);
        setCurrentView('editor');
        loadWebStudioEditor(newProject.id, templateId);
      } else {
        // Demo mode - create mock project
        const newProject: WebStudioProject = {
          id: `proj-${Date.now()}`,
          name: templateId ? `New ${templateId} Site` : 'New Website',
          description: 'Created with WebStudio',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft'
        };
        setCurrentProject(newProject);
        setProjects(prev => [...prev, newProject]);
        setCurrentView('editor');
        loadWebStudioEditor(newProject.id, templateId);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
    setIsLoading(false);
  };

  const loadWebStudioEditor = (projectId: string, templateId?: string) => {
    if (webstudioIframeRef.current) {
      const baseUrl = WEBSTUDIO_CONFIG.useHosted 
        ? WEBSTUDIO_CONFIG.hostedUrl 
        : WEBSTUDIO_CONFIG.selfHostedUrl;
      
      let editorUrl = `${baseUrl}/builder/${projectId}`;
      
      // Add template parameter if specified
      if (templateId) {
        editorUrl += `?template=${templateId}`;
      }

      // Add organization context
      editorUrl += `${templateId ? '&' : '?'}org=${organisationDetails.id}`;

      webstudioIframeRef.current.src = editorUrl;
      setEditorReady(true);
    }
  };

  const openProject = (project: WebStudioProject) => {
    setCurrentProject(project);
    setCurrentView('editor');
    loadWebStudioEditor(project.id);
  };

  const deployProject = async (project: WebStudioProject) => {
    if (!project) return;

    try {
      // Update project status
      const updatedProject = { ...project, status: 'deploying' as const };
      setCurrentProject(updatedProject);
      setProjects(prev => 
        prev.map(p => p.id === project.id ? updatedProject : p)
      );

      // Deploy via your API
      const response = await fetch(`/api/webstudio/deploy/${project.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: organisationDetails.id })
      });

      if (response.ok) {
        const deployResult = await response.json();
        const publishedProject = {
          ...updatedProject,
          status: 'published' as const,
          deployUrl: deployResult.url,
          updatedAt: new Date().toISOString()
        };
        
        setCurrentProject(publishedProject);
        setProjects(prev => 
          prev.map(p => p.id === project.id ? publishedProject : p)
        );
        
        alert(`Site deployed successfully! URL: ${deployResult.url}`);
      } else {
        throw new Error('Deployment failed');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Deployment failed. Please try again.');
      
      // Revert status
      const revertedProject = { ...project, status: project.status };
      setCurrentProject(revertedProject);
      setProjects(prev => 
        prev.map(p => p.id === project.id ? revertedProject : p)
      );
    }
  };

  const exportProject = async (project: WebStudioProject) => {
    try {
      const response = await fetch(`/api/webstudio/export/${project.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Handle messages from WebStudio iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from WebStudio
      const webstudioOrigin = WEBSTUDIO_CONFIG.useHosted 
        ? new URL(WEBSTUDIO_CONFIG.hostedUrl).origin
        : new URL(WEBSTUDIO_CONFIG.selfHostedUrl).origin;
      
      if (event.origin !== webstudioOrigin) return;

      switch (event.data.type) {
        case 'webstudio:ready':
          setEditorReady(true);
          break;
        case 'webstudio:save':
          // Handle save events
          if (currentProject) {
            const updatedProject = {
              ...currentProject,
              updatedAt: new Date().toISOString()
            };
            setCurrentProject(updatedProject);
            setProjects(prev => 
              prev.map(p => p.id === currentProject.id ? updatedProject : p)
            );
          }
          break;
        case 'webstudio:publish':
          // Handle publish requests
          if (currentProject) {
            deployProject(currentProject);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentProject]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-6 w-6" />
              WebStudio Builder
            </CardTitle>
            <CardDescription>
              Professional website builder powered by WebStudio open source
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {currentProject && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportProject(currentProject)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => deployProject(currentProject)}
                  disabled={currentProject.status === 'deploying'}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {currentProject.status === 'deploying' ? 'Deploying...' : 'Deploy'}
                </Button>
              </>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="editor" disabled={!currentProject}>Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Choose a Template</h3>
              <p className="text-sm text-muted-foreground">Start with a professional template or create from scratch</p>
            </div>
            <Button onClick={() => createNewProject()} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Start from Scratch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webstudioTemplates.map((template) => (
              <Card 
                key={template.id}
                className="cursor-pointer transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <Eye className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Template Preview</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => createNewProject(template.webstudioId)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Use Template'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Your Projects</h3>
              <p className="text-sm text-muted-foreground">Manage your website projects</p>
            </div>
            <Button onClick={() => setCurrentView('templates')}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{project.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'published' ? 'bg-green-100 text-green-700' :
                          project.status === 'deploying' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                        {project.deployUrl && (
                          <a 
                            href={project.deployUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Live Site
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportProject(project)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openProject(project)}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {projects.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Layout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first website to get started</p>
                  <Button onClick={() => setCurrentView('templates')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {currentProject ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>{currentProject.name}</CardTitle>
                  <CardDescription>{currentProject.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView('projects')}
                  >
                    ← Back to Projects
                  </Button>
                  {currentProject.deployUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(currentProject.deployUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full h-[800px] bg-white rounded-lg overflow-hidden">
                  <iframe
                    ref={webstudioIframeRef}
                    className="w-full h-full border-0"
                    title="WebStudio Editor"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
                  />
                  {!editorReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold mb-2">Loading WebStudio Editor</p>
                        <p className="text-sm text-muted-foreground">Preparing your visual development environment...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No project selected</h3>
                <p className="text-muted-foreground mb-4">Choose a project to edit or create a new one</p>
                <Button onClick={() => setCurrentView('projects')}>
                  View Projects
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* WebStudio Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            WebStudio Integration
          </CardTitle>
          <CardDescription>
            Powered by WebStudio open source platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="font-medium">Visual Development</p>
                <p className="text-muted-foreground">Drag-and-drop interface with full CSS control</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="font-medium">Custom Components</p>
                <p className="text-muted-foreground">Build and reuse your own components</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="font-medium">Deploy Anywhere</p>
                <p className="text-muted-foreground">Export static files or deploy to any host</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Using WebStudio {WEBSTUDIO_CONFIG.useHosted ? 'Hosted' : 'Self-Hosted'} • 
              Learn more at <a href="https://webstudio.is" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">webstudio.is</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}