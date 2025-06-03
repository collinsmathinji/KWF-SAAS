"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout, Code, Eye, Save, Plus, Globe, Trash2, Edit } from "lucide-react"
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

interface WebStudioProps {
  organisationDetails: OrganizationDetails;
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
      <header class="header">
        <nav class="nav">
          <div class="nav-brand">TechCorp Solutions</div>
          <div class="nav-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>
      <main class="main">
        <section class="hero">
          <h1>Transform Your Business Digital Future</h1>
          <p>We provide cutting-edge technology solutions to help your business thrive in the digital age</p>
          <button class="cta-button">Get Started Today</button>
        </section>
        <section class="services">
          <h2>Our Services</h2>
          <div class="service-grid">
            <div class="service-card">
              <h3>Web Development</h3>
              <p>Custom websites and web applications</p>
            </div>
            <div class="service-card">
              <h3>Cloud Solutions</h3>
              <p>Scalable cloud infrastructure</p>
            </div>
            <div class="service-card">
              <h3>Consulting</h3>
              <p>Strategic technology guidance</p>
            </div>
          </div>
        </section>
      </main>
    `,
    css: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Arial', sans-serif; line-height: 1.6; }
      .header { background: #2c3e50; color: white; padding: 1rem 0; }
      .nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
      .nav-brand { font-size: 1.5rem; font-weight: bold; }
      .nav-links a { color: white; text-decoration: none; margin-left: 2rem; }
      .nav-links a:hover { color: #3498db; }
      .main { max-width: 1200px; margin: 0 auto; }
      .hero { text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
      .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
      .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
      .cta-button { background: #e74c3c; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 5px; cursor: pointer; }
      .cta-button:hover { background: #c0392b; }
      .services { padding: 4rem 2rem; }
      .services h2 { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #2c3e50; }
      .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
      .service-card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; }
      .service-card h3 { color: #2c3e50; margin-bottom: 1rem; }
    `
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    description: 'Showcase your creative work',
    html: `
      <header class="portfolio-header">
        <div class="container">
          <h1>Sarah Chen</h1>
          <p class="tagline">UI/UX Designer & Creative Director</p>
          <div class="social-links">
            <a href="#">LinkedIn</a>
            <a href="#">Dribbble</a>
            <a href="#">Behance</a>
          </div>
        </div>
      </header>
      <main class="portfolio-main">
        <section class="about-section">
          <div class="container">
            <h2>About Me</h2>
            <p>I'm a passionate designer with 8+ years of experience creating beautiful, user-centered digital experiences. I specialize in UI/UX design, branding, and creative direction.</p>
          </div>
        </section>
        <section class="portfolio-grid">
          <div class="container">
            <h2>Featured Work</h2>
            <div class="project-grid">
              <div class="project-card">
                <div class="project-image">Mobile App Redesign</div>
                <h3>FinTech Mobile App</h3>
                <p>Complete redesign of a financial mobile application</p>
              </div>
              <div class="project-card">
                <div class="project-image">E-commerce Platform</div>
                <h3>Fashion E-commerce</h3>
                <p>Modern e-commerce platform for fashion brands</p>
              </div>
              <div class="project-card">
                <div class="project-image">Brand Identity</div>
                <h3>Startup Branding</h3>
                <p>Complete brand identity for tech startup</p>
              </div>
              <div class="project-card">
                <div class="project-image">Web Application</div>
                <h3>SaaS Dashboard</h3>
                <p>Intuitive dashboard for project management tool</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    `,
    css: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Helvetica', sans-serif; line-height: 1.6; background: #f8f9fa; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
      .portfolio-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 0; text-align: center; }
      .portfolio-header h1 { font-size: 4rem; margin-bottom: 1rem; font-weight: 300; }
      .tagline { font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9; }
      .social-links a { color: white; text-decoration: none; margin: 0 1rem; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px; transition: all 0.3s; }
      .social-links a:hover { background: rgba(255,255,255,0.2); }
      .about-section { padding: 4rem 0; background: white; }
      .about-section h2 { font-size: 2.5rem; margin-bottom: 2rem; color: #2c3e50; text-align: center; }
      .about-section p { font-size: 1.2rem; text-align: center; max-width: 800px; margin: 0 auto; color: #666; }
      .portfolio-grid { padding: 4rem 0; }
      .portfolio-grid h2 { font-size: 2.5rem; margin-bottom: 3rem; color: #2c3e50; text-align: center; }
      .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
      .project-card { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s; }
      .project-card:hover { transform: translateY(-5px); }
      .project-image { height: 200px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem; }
      .project-card h3 { padding: 1.5rem 1.5rem 0.5rem; color: #2c3e50; }
      .project-card p { padding: 0 1.5rem; color: #666; }
    `
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Elegant restaurant template',
    html: `
      <header class="restaurant-header">
        <nav class="restaurant-nav">
          <div class="logo">Bella Vista</div>
          <div class="nav-menu">
            <a href="#menu">Menu</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#reservation" class="reserve-btn">Reserve Table</a>
          </div>
        </nav>
        <div class="hero-content">
          <h1>Authentic Italian Cuisine</h1>
          <p>Experience the finest flavors of Italy in the heart of the city</p>
        </div>
      </header>
      <main class="restaurant-main">
        <section class="featured-dishes">
          <div class="container">
            <h2>Chef's Specialties</h2>
            <div class="dishes-grid">
              <div class="dish-card">
                <div class="dish-image">Truffle Risotto</div>
                <h3>Truffle Risotto</h3>
                <p>Creamy Arborio rice with black truffle and parmesan</p>
                <span class="price">$28</span>
              </div>
              <div class="dish-card">
                <div class="dish-image">Osso Buco</div>
                <h3>Osso Buco</h3>
                <p>Braised veal shanks with saffron risotto</p>
                <span class="price">$35</span>
              </div>
              <div class="dish-card">
                <div class="dish-image">Tiramisu</div>
                <h3>Classic Tiramisu</h3>
                <p>Traditional Italian dessert with mascarpone</p>
                <span class="price">$12</span>
              </div>
            </div>
          </div>
        </section>
        <section class="restaurant-info">
          <div class="container">
            <div class="info-grid">
              <div class="info-card">
                <h3>Hours</h3>
                <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
                <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                <p>Sunday: 4:00 PM - 9:00 PM</p>
              </div>
              <div class="info-card">
                <h3>Location</h3>
                <p>123 Culinary Street</p>
                <p>Downtown District</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    `,
    css: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Georgia', serif; line-height: 1.6; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
      .restaurant-header { background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" fill="%23654321"><rect width="1200" height="600"/></svg>'); background-size: cover; color: white; min-height: 100vh; }
      .restaurant-nav { display: flex; justify-content: space-between; align-items: center; padding: 2rem; }
      .logo { font-size: 2rem; font-weight: bold; font-family: 'serif'; }
      .nav-menu { display: flex; align-items: center; gap: 2rem; }
      .nav-menu a { color: white; text-decoration: none; transition: color 0.3s; }
      .nav-menu a:hover { color: #d4af37; }
      .reserve-btn { background: #d4af37 !important; padding: 0.5rem 1.5rem !important; border-radius: 25px !important; }
      .hero-content { text-align: center; padding: 8rem 2rem; }
      .hero-content h1 { font-size: 4rem; margin-bottom: 1rem; font-weight: 300; }
      .hero-content p { font-size: 1.3rem; opacity: 0.9; }
      .featured-dishes { padding: 6rem 0; background: #f8f8f8; }
      .featured-dishes h2 { text-align: center; font-size: 3rem; margin-bottom: 4rem; color: #333; }
      .dishes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem; }
      .dish-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
      .dish-image { height: 250px; background: linear-gradient(45deg, #8B4513, #D2691E); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold; }
      .dish-card h3 { padding: 1.5rem 1.5rem 0.5rem; color: #333; font-size: 1.5rem; }
      .dish-card p { padding: 0 1.5rem; color: #666; margin-bottom: 1rem; }
      .price { display: block; padding: 0 1.5rem 1.5rem; color: #d4af37; font-size: 1.3rem; font-weight: bold; }
      .restaurant-info { padding: 6rem 0; }
      .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; }
      .info-card { text-align: center; }
      .info-card h3 { font-size: 2rem; margin-bottom: 1.5rem; color: #333; }
      .info-card p { margin-bottom: 0.5rem; color: #666; font-size: 1.1rem; }
    `
  }
];

// Dummy data for existing projects
const dummyProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'TechCorp Landing Page',
    description: 'Modern business website for tech company',
    html: defaultTemplates[0].html,
    css: defaultTemplates[0].css,
    createdAt: '2024-05-15T10:30:00Z',
    updatedAt: '2024-05-20T14:45:00Z',
    published: true,
    url: 'https://demo.techcorp.com/proj-1'
  },
  {
    id: 'proj-2',
    name: 'Creative Portfolio Site',
    description: 'Portfolio website for UI/UX designer',
    html: defaultTemplates[1].html,
    css: defaultTemplates[1].css,
    createdAt: '2024-05-10T09:15:00Z',
    updatedAt: '2024-05-22T16:20:00Z',
    published: true,
    url: 'https://sarahchen.portfolio.com/proj-2'
  },
  {
    id: 'proj-3',
    name: 'Bella Vista Restaurant',
    description: 'Elegant restaurant website',
    html: defaultTemplates[2].html,
    css: defaultTemplates[2].css,
    createdAt: '2024-05-08T14:20:00Z',
    updatedAt: '2024-05-18T11:30:00Z',
    published: false
  },
  {
    id: 'proj-4',
    name: 'Personal Blog',
    description: 'Simple blog layout',
    html: `
      <header class="blog-header">
        <div class="container">
          <h1>Digital Nomad Diaries</h1>
          <p>Adventures in remote work and travel</p>
        </div>
      </header>
      <main class="blog-main">
        <article class="blog-post">
          <h2>Working from Bali: Week 1</h2>
          <p class="post-meta">Posted on March 15, 2024</p>
          <p>Just arrived in Ubud and I'm already in love with this place. The coworking spaces here are incredible, and the community of digital nomads is so welcoming...</p>
          <a href="#" class="read-more">Read More</a>
        </article>
        <article class="blog-post">
          <h2>The Best Remote Work Tools of 2024</h2>
          <p class="post-meta">Posted on March 10, 2024</p>
          <p>After working remotely for 3 years, I've tried dozens of productivity tools. Here are the ones that actually made a difference...</p>
          <a href="#" class="read-more">Read More</a>
        </article>
      </main>
    `,
    css: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Georgia', serif; line-height: 1.8; color: #333; }
      .container { max-width: 800px; margin: 0 auto; padding: 0 2rem; }
      .blog-header { background: #2c3e50; color: white; padding: 4rem 0; text-align: center; }
      .blog-header h1 { font-size: 3rem; margin-bottom: 1rem; }
      .blog-header p { font-size: 1.2rem; opacity: 0.8; }
      .blog-main { padding: 4rem 0; }
      .blog-post { margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid #eee; }
      .blog-post h2 { font-size: 2rem; margin-bottom: 1rem; color: #2c3e50; }
      .post-meta { color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; font-style: italic; }
      .blog-post p { margin-bottom: 1.5rem; font-size: 1.1rem; }
      .read-more { color: #3498db; text-decoration: none; font-weight: bold; }
      .read-more:hover { text-decoration: underline; }
    `,
    createdAt: '2024-05-05T16:45:00Z',
    updatedAt: '2024-05-12T09:10:00Z',
    published: false
  }
];

// Dummy organization details
const dummyOrganization: OrganizationDetails = {
  id: 'org-1',
  name: 'Creative Studio Pro',
  domain: 'creativestudio.com'
};

export default function WebStudioPage({ organisationDetails }: WebStudioProps) {
  const [currentView, setCurrentView] = useState<'edit' | 'preview'>('edit')
  const [projects, setProjects] = useState<Project[]>(dummyProjects)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [editingHtml, setEditingHtml] = useState('')
  const [editingCss, setEditingCss] = useState('')
  const [editingProjectName, setEditingProjectName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  const createNewProject = (template?: typeof defaultTemplates[0]) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: template ? `New ${template.name}` : 'Untitled Project',
      description: template ? template.description : 'A new website project',
      html: template ? template.html : '<h1>Welcome to your new website</h1>',
      css: template ? template.css : 'h1 { color: #333; font-family: Arial, sans-serif; text-align: center; margin-top: 2rem; }',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false
    };

    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setEditingHtml(newProject.html);
    setEditingCss(newProject.css);
    setEditingProjectName(newProject.name);
  };

  const saveProject = () => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      name: editingProjectName,
      html: editingHtml,
      css: editingCss,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const publishProject = () => {
    if (!currentProject || !organisationDetails?.domain) return;

    const updatedProject = {
      ...currentProject,
      published: true,
      url: `https://${organisationDetails.domain}/${currentProject.id}`,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  const duplicateProject = (project: Project) => {
    const duplicatedProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      url: undefined
    };

    setProjects([duplicatedProject, ...projects]);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">Website Builder</CardTitle>
            <CardDescription className="text-lg">
              Create and manage beautiful websites for {organisationDetails?.name}
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
              <Button onClick={saveProject} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={publishProject} className="bg-green-600 hover:bg-green-700">
                <Globe className="h-4 w-4 mr-2" />
                {currentProject.published ? 'Update Live' : 'Publish'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentProject(null)}
              >
                ← Back to Projects
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      {!currentProject ? (
        <div className="space-y-6">
          {/* Templates Section */}
          <Card>
            <CardHeader>
              <CardTitle>Start New Project</CardTitle>
              <CardDescription>Choose a template or start from scratch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105" onClick={() => createNewProject()}>
                  <CardHeader className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <CardTitle className="text-lg">Blank Project</CardTitle>
                    <CardDescription>Start from scratch</CardDescription>
                  </CardHeader>
                </Card>
                {defaultTemplates.map(template => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => createNewProject(template)}
                  >
                    <CardHeader className="text-center">
                      <Layout className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Existing Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Your Projects ({projects.length})</CardTitle>
              <CardDescription>Manage your existing websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {projects.map(project => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => {
                      setCurrentProject(project);
                      setEditingHtml(project.html);
                      setEditingCss(project.css);
                      setEditingProjectName(project.name);
                    }}>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        {project.published && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{project.description}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(project.createdAt).toLocaleDateString()} • 
                        Updated: {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.published && project.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-1" />
                            View Live
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => duplicateProject(project)}
                      >
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Project Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {isEditingName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingProjectName}
                      onChange={(e) => setEditingProjectName(e.target.value)}
                      className="text-xl font-semibold"
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditingName(false);
                          saveProject();
                        }
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <h2 
                    className="text-xl font-semibold flex-1 cursor-pointer hover:text-blue-600"
                    onClick={() => setIsEditingName(true)}
                  >
                    {editingProjectName} <Edit className="h-4 w-4 inline ml-1" />
                  </h2>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Editor Section */}
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="html" className="w-full">
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                </TabsList>
                <TabsContent value="html">
                  <Textarea
                    value={editingHtml}
                    onChange={(e) => setEditingHtml(e.target.value)}
                    className="min-h-[500px] font-mono"
                    placeholder="Enter your HTML code here..."
                  />
                </TabsContent>
                <TabsContent value="css">
                  <Textarea
                    value={editingCss}
                    onChange={(e) => setEditingCss(e.target.value)}
                    className="min-h-[500px] font-mono"
                    placeholder="Enter your CSS code here..."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {currentView === 'preview' && (
            <Card>
              <CardContent className="p-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>${editingCss}</style>
                        </head>
                        <body>
                          ${editingHtml}
                        </body>
                      </html>
                    `}
                    className="w-full min-h-[600px]"
                    title="Preview"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}