"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Database,
  ExternalLink,
  LineChart,
  Menu,
  PieChart,
  TableProperties,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sendContactFormEmail } from "./actions"
import { toast } from "@/components/ui/use-toast"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
    isSubmitting?: boolean;
  }>({})
  const sections = ["home", "about", "skills", "portfolio", "contact"]
  const observerRefs = useRef<IntersectionObserver[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const sectionElements = sections.map((section) =>
      section === "home" ? document.getElementById("hero") : document.getElementById(section),
    )

    observerRefs.current = sectionElements.map((element, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sections[index])
          }
        },
        { threshold: 0.5 },
      )

      if (element) observer.observe(element)
      return observer
    })

    return () => {
      observerRefs.current.forEach((observer, index) => {
        const element = sectionElements[index]
        if (element) observer.unobserve(element)
      })
    }
  }, [])

  // Contact form submission handler
  async function handleContactFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus({ isSubmitting: true });
    
    try {
      const formData = new FormData(event.currentTarget);
      const result = await sendContactFormEmail(formData);
      
      setFormStatus({
        success: result.success,
        message: result.message,
        isSubmitting: false
      });
      
      // Show toast notification
      toast({
        title: result.success ? "Message Sent" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      
      // Clear form if successful
      if (result.success && formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormStatus({
        success: false,
        message: "There was an error sending your message. Please try again.",
        isSubmitting: false
      });
      
      // Show error toast
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </motion.div>
            <span className="text-base font-bold tracking-tight">Data Analyst</span>
          </Link>
          <nav className="hidden md:flex md:gap-4 lg:gap-8">
            {sections.map((section) => (
              <Link
                key={section}
                href={section === "home" ? "#hero" : `#${section}`}
                className={`relative text-sm font-medium transition-colors ${
                  activeSection === section ? "text-emerald-400" : "text-white/70 hover:text-white"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </Link>
            ))}
          </nav>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 flex flex-col bg-black p-4"
          >
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="mt-6 flex flex-col gap-4">
              {sections.map((section) => (
                <Link
                  key={section}
                  href={section === "home" ? "#hero" : `#${section}`}
                  className={`text-xl font-medium ${activeSection === section ? "text-emerald-400" : "text-white/70"}`}
                  onClick={() => {
                    setActiveSection(section)
                    setMobileMenuOpen(false)
                  }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <section id="hero" className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-12 md:py-16">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)]"></div>
            <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-emerald-900/20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-emerald-900/20 blur-3xl"></div>
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center space-y-4"
              >
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400"
                  >
                    Data Visualization Expert
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="text-xl font-medium text-white/90"
                  >
                    Hi, I'm Chadwig Walter
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                  >
                    Turning Data Into <span className="text-emerald-400">Powerful Stories</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="max-w-[600px] text-white/70 text-sm sm:text-base md:text-lg"
                  >
                    I create stunning data visualizations, interactive dashboards, and data-driven applications that
                    help businesses make better decisions.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-col gap-3 min-[400px]:flex-row"
                >
                  <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-600">
                    <Link href="#portfolio">
                      View My Work
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Link href="#contact">Contact Me</Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center justify-center"
              >
                <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-full w-full">
                      <div className="absolute top-1/2 left-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-3xl"></div>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute top-0 left-1/2 h-[150px] w-[150px] -translate-x-1/2 rounded-full border border-emerald-500/30"
                      />
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute top-1/4 left-1/2 h-[250px] w-[250px] -translate-x-1/2 rounded-full border border-emerald-500/20"
                      />
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute top-1/3 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full border border-emerald-500/10"
                      />

                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                        <BarChart3 className="h-32 w-32 text-emerald-500" />
                      </motion.div>

                      <motion.div
                        initial={{ x: -50, y: -80, opacity: 0.5 }}
                        animate={{ x: [-50, -30, -50], y: [-80, -100, -80], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2"
                      >
                        <PieChart className="h-16 w-16 text-emerald-400/60" />
                      </motion.div>

                      <motion.div
                        initial={{ x: 70, y: 40, opacity: 0.5 }}
                        animate={{ x: [70, 90, 70], y: [40, 20, 40], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2"
                      >
                        <LineChart className="h-14 w-14 text-emerald-400/60" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Link href="#about" className="flex flex-col items-center text-white/50 hover:text-white">
                <span className="text-xs">Scroll</span>
                <ChevronRight className="h-4 w-4 rotate-90" />
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="about" className="relative py-20 md:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1)_0,transparent_60%)]"></div>
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400"
                >
                  About Me
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Data Analyst & Visualization Specialist
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-4 max-w-[800px] text-white/70 md:text-lg"
                >
                  I transform complex data into clear, actionable insights through powerful visualizations and
                  interactive dashboards. With expertise in data walls, Power BI, and custom web applications, I help
                  businesses understand their data and make informed decisions.
                </motion.p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="group relative overflow-hidden border-white/10 bg-white/5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5">
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-300 group-hover:bg-emerald-500/20"></div>
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-white">Data Visualization</h3>
                      <p className="text-white/70">
                        Creating clear, impactful visualizations that tell a story and highlight key insights from
                        complex datasets.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Card className="group relative overflow-hidden border-white/10 bg-white/5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5">
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-300 group-hover:bg-emerald-500/20"></div>
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <TableProperties className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-white">Dashboard Development</h3>
                      <p className="text-white/70">
                        Building interactive dashboards that provide real-time monitoring and analysis of business
                        metrics.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Card className="group relative overflow-hidden border-white/10 bg-white/5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5">
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-300 group-hover:bg-emerald-500/20"></div>
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Database className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-white">Data Processing</h3>
                      <p className="text-white/70">
                        Cleaning, transforming, and preparing data to ensure accuracy and reliability in analysis and
                        reporting.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="relative py-20 md:py-32 bg-gradient-to-b from-black to-emerald-950/20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0,transparent_70%)]"></div>
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400"
                >
                  My Expertise
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Skills & Technologies
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-4 max-w-[800px] text-white/70 md:text-lg"
                >
                  My technical toolkit for transforming data into actionable insights
                </motion.p>
              </div>

              <Tabs defaultValue="visualization" className="w-full">
                <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3 bg-white/5">
                  <TabsTrigger
                    value="visualization"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                  >
                    Visualization
                  </TabsTrigger>
                  <TabsTrigger
                    value="analysis"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                  >
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="development"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                  >
                    Development
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="visualization" className="mt-0">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <SkillCard
                      icon={<BarChart3 className="h-6 w-6" />}
                      title="Power BI"
                      description="Expert in creating interactive Power BI dashboards with DAX, data modeling, and custom visualizations."
                      progress={95}
                    />
                    <SkillCard
                      icon={<TableProperties className="h-6 w-6" />}
                      title="Data Walls"
                      description="Experienced in creating comprehensive data walls for monitoring KPIs and business performance metrics."
                      progress={90}
                    />
                    <SkillCard
                      icon={<PieChart className="h-6 w-6" />}
                      title="Tableau"
                      description="Creating interactive dashboards and visualizations for data exploration and business intelligence."
                      progress={85}
                    />
                    <SkillCard
                      icon={<LineChart className="h-6 w-6" />}
                      title="D3.js"
                      description="Building custom, interactive data visualizations for web applications using D3.js."
                      progress={80}
                    />
                    <SkillCard
                      icon={<BarChart3 className="h-6 w-6" />}
                      title="Google Data Studio"
                      description="Creating shareable dashboards and reports connected to various data sources."
                      progress={85}
                    />
                    <SkillCard
                      icon={<PieChart className="h-6 w-6" />}
                      title="Excel Advanced"
                      description="Advanced Excel skills including pivot tables, Power Query, and data visualization."
                      progress={90}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="mt-0">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <SkillCard
                      icon={<Database className="h-6 w-6" />}
                      title="SQL"
                      description="Expert in SQL querying, data modeling, and database optimization for data analysis."
                      progress={95}
                    />
                    <SkillCard
                      icon={<Database className="h-6 w-6" />}
                      title="Python"
                      description="Data analysis with pandas, numpy, and scikit-learn for statistical analysis and machine learning."
                      progress={85}
                    />
                    <SkillCard
                      icon={<Database className="h-6 w-6" />}
                      title="R"
                      description="Statistical analysis and data visualization using R and its powerful ecosystem of packages."
                      progress={80}
                    />
                    <SkillCard
                      icon={<PieChart className="h-6 w-6" />}
                      title="Statistical Analysis"
                      description="Applying statistical methods to extract insights and identify patterns in data."
                      progress={90}
                    />
                    <SkillCard
                      icon={<LineChart className="h-6 w-6" />}
                      title="Predictive Modeling"
                      description="Building predictive models to forecast trends and support decision-making."
                      progress={85}
                    />
                    <SkillCard
                      icon={<Database className="h-6 w-6" />}
                      title="ETL Processes"
                      description="Designing and implementing ETL processes for data warehousing and analytics."
                      progress={90}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="development" className="mt-0">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <SkillCard
                      icon={<LineChart className="h-6 w-6" />}
                      title="Web Applications"
                      description="Building custom web applications for data analysis and visualization using modern frameworks."
                      progress={85}
                    />
                    <SkillCard
                      icon={<Database className="h-6 w-6" />}
                      title="API Integration"
                      description="Connecting to various APIs to collect, process, and visualize data from different sources."
                      progress={90}
                    />
                    <SkillCard
                      icon={<TableProperties className="h-6 w-6" />}
                      title="JavaScript"
                      description="Front-end development for interactive data visualizations and dashboard components."
                      progress={85}
                    />
                    <SkillCard
                      icon={<Database className="h-6 w-6" />}
                      title="Cloud Platforms"
                      description="Working with AWS, Azure, and Google Cloud for data storage, processing, and analytics."
                      progress={80}
                    />
                    <SkillCard
                      icon={<Database className="h-6 w-6" />}
                      title="Big Data"
                      description="Experience with big data technologies like Hadoop and Spark for large-scale data processing."
                      progress={75}
                    />
                    <SkillCard
                      icon={<TableProperties className="h-6 w-6" />}
                      title="DevOps"
                      description="CI/CD pipelines, containerization, and infrastructure as code for data applications."
                      progress={70}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section id="portfolio" className="relative py-20 md:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1)_0,transparent_50%)]"></div>
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400"
                >
                  My Work
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Featured Projects
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-4 max-w-[800px] text-white/70 md:text-lg"
                >
                  A showcase of my data analysis and visualization projects
                </motion.p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <ProjectCard
                  title="Sales Performance Dashboard"
                  category="Power BI"
                  description="Interactive dashboard tracking sales team performance, pipeline metrics, and revenue forecasting."
                  image="/placeholder.svg?height=600&width=800"
                />
                <ProjectCard
                  title="Marketing Analytics Platform"
                  category="Web Application"
                  description="Custom web application for tracking campaign performance, customer acquisition costs, and ROI metrics."
                  image="/placeholder.svg?height=600&width=800"
                />
                <ProjectCard
                  title="Operations Data Wall"
                  category="Real-time Monitoring"
                  description="Comprehensive data wall displaying real-time operational metrics, productivity, and efficiency KPIs."
                  image="/placeholder.svg?height=600&width=800"
                />
                <ProjectCard
                  title="Financial Analysis Dashboard"
                  category="Power BI"
                  description="Financial performance dashboard with P&L analysis, budget tracking, and financial forecasting."
                  image="/placeholder.svg?height=600&width=800"
                />
                <ProjectCard
                  title="Customer Insights Platform"
                  category="Data Analysis"
                  description="Customer segmentation and behavior analysis platform with predictive modeling for customer retention."
                  image="/placeholder.svg?height=600&width=800"
                />
                <ProjectCard
                  title="Supply Chain Visualization"
                  category="Interactive Dashboard"
                  description="End-to-end supply chain visualization with inventory management, logistics tracking, and optimization."
                  image="/placeholder.svg?height=600&width=800"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="relative py-20 md:py-32 bg-gradient-to-b from-black to-emerald-950/20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.1)_0,transparent_70%)]"></div>
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400"
                >
                  Get In Touch
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Let's Work Together
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-4 max-w-[800px] text-white/70 md:text-lg"
                >
                  Interested in working together? Let's discuss how I can help with your data needs.
                </motion.p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <h3 className="mb-6 text-2xl font-bold">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-white/50">Phone</p>
                        <p className="font-medium">+254715343499</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-white/50">Email</p>
                        <p className="font-medium">chadwig87@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-white/50">Location</p>
                        <p className="font-medium">Nairobi, Kenya</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="mb-4 text-lg font-semibold">Connect With Me</h4>
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-emerald-500 hover:text-black"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-emerald-500 hover:text-black"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-emerald-500 hover:text-black"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <h3 className="mb-6 text-2xl font-bold">Send Me a Message</h3>
                  <form ref={formRef} onSubmit={handleContactFormSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Your message"
                      />
                    </div>
                    {formStatus.message && (
                      <div className={`p-3 rounded-md ${formStatus.success ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}`}>
                        {formStatus.message}
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      disabled={formStatus.isSubmitting}
                      className="w-full bg-emerald-500 text-black hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formStatus.isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10 py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              <span className="text-lg font-bold">Data Analyst</span>
            </div>
            <p className="text-center text-sm text-white/50 md:text-left">
              © 2025 Data Analyst Portfolio. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-white/70 hover:text-emerald-400">
                LinkedIn
              </Link>
              <Link href="#" className="text-sm text-white/70 hover:text-emerald-400">
                GitHub
              </Link>
              <Link href="#" className="text-sm text-white/70 hover:text-emerald-400">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SkillCard({ 
  icon, 
  title, 
  description, 
  progress 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  progress: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card className="h-full overflow-hidden border-white/10 bg-white/5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                {icon}
              </div>
              <h3 className="font-bold text-white">{title}</h3>
            </div>
            <span className="text-sm font-medium text-emerald-400">{progress}%</span>
          </div>
          <p className="mb-4 text-sm text-white/70">{description}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProjectCard({ 
  title, 
  category, 
  description, 
  image 
}: { 
  title: string; 
  category: string; 
  description: string; 
  image: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 transition-all duration-300 hover:border-emerald-500/30">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              variant="outline"
              size="sm"
              className="border-white bg-black/50 text-white backdrop-blur-sm hover:bg-white hover:text-black"
            >
              View Project
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="mb-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            {category}
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
