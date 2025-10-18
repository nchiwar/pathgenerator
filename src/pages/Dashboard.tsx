import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useLearningPathStore, Course } from '@/stores/learningPathStore';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/CourseCard';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  GraduationCap, 
  LogOut, 
  Plus, 
  Target, 
  Clock, 
  TrendingUp,
  Book,
  Award
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setSession } = useAuthStore();
  const { currentPath, setCurrentPath, setAllPaths, allPaths } = useLearningPathStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [coursesWithProgress, setCoursesWithProgress] = useState<Course[]>([]);

  useEffect(() => {
    loadLearningPaths();
  }, [user]);

  useEffect(() => {
    if (currentPath?.id) {
      loadCoursesWithProgress(currentPath.id);
    }
  }, [currentPath]);

  const loadLearningPaths = async () => {
    if (!user) return;

    try {
      const { data: paths, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllPaths(paths || []);
      if (paths && paths.length > 0) {
        setCurrentPath(paths[0]);
      }
    } catch (error: any) {
      console.error('Error loading paths:', error);
      toast.error('Failed to load learning paths');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoursesWithProgress = async (pathId: string) => {
    try {
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('path_id', pathId)
        .order('sequence_order');

      if (coursesError) throw coursesError;

      const { data: progress, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user!.id);

      if (progressError) throw progressError;

      const coursesWithProgressData = courses?.map(course => {
        const courseProgress = progress?.find(p => p.course_id === course.id);
        return {
          ...course,
          progress: courseProgress?.completion_percentage || 0,
        };
      }) || [];

      setCoursesWithProgress(coursesWithProgressData);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const updateProgress = async (courseId: string, newProgress: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          completion_percentage: newProgress,
          completed_at: newProgress === 100 ? new Date().toISOString() : null,
        });

      if (error) throw error;

      setCoursesWithProgress(prev =>
        prev.map(c => c.id === courseId ? { ...c, progress: newProgress } : c)
      );

      toast.success('Progress updated!');
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  const overallProgress = coursesWithProgress.length > 0
    ? Math.round(
        coursesWithProgress.reduce((sum, c) => sum + (c.progress || 0), 0) /
        coursesWithProgress.length
      )
    : 0;

  const completedCourses = coursesWithProgress.filter(c => c.progress === 100).length;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
          <div className="text-center">
            <div className="animate-pulse-glow">
              <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
            </div>
            <p className="text-muted-foreground">Loading your learning path...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!currentPath) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
          <Card className="p-12 text-center max-w-md shadow-card animate-scale-in">
            <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start Your Journey</h2>
            <p className="text-muted-foreground mb-6">
              Create your first personalized learning path to begin your journey
            </p>
            <Button variant="hero" onClick={() => navigate('/onboarding')} size="lg">
              <Plus className="w-5 h-5" />
              Create Learning Path
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">PathFinder</h1>
                  <p className="text-sm text-muted-foreground">Welcome back!</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate('/onboarding')}>
                  <Plus className="w-4 h-4" />
                  New Path
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 bg-gradient-card shadow-card animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Career Goal</p>
                  <p className="font-semibold truncate">{currentPath.career_goal}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Book className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="font-semibold text-2xl">{coursesWithProgress.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="font-semibold text-2xl">{completedCourses}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="font-semibold text-2xl">{overallProgress}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card className="p-6 mb-8 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Learning Path Progress</h2>
                <p className="text-sm text-muted-foreground">
                  {currentPath.skill_level} • {currentPath.weekly_hours} hrs/week • {currentPath.duration_months} months
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </Card>

          {/* Courses Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Book className="w-6 h-6 text-primary" />
              Your Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesWithProgress.map((course, index) => (
                <div
                  key={course.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CourseCard
                    course={course}
                    onViewDetails={setSelectedCourse}
                    onUpdateProgress={updateProgress}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Course Details Dialog */}
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedCourse?.title}</DialogTitle>
              <DialogDescription>
                {selectedCourse?.provider && `by ${selectedCourse.provider}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {selectedCourse?.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                  {selectedCourse?.phase}
                </span>
              </div>
              
              {selectedCourse?.description && (
                <p className="text-muted-foreground">{selectedCourse.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedCourse?.duration_weeks} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedCourse?.progress}% complete</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{selectedCourse?.progress}%</span>
                </div>
                <Progress value={selectedCourse?.progress || 0} className="h-2" />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (selectedCourse) {
                      const newProgress = Math.min((selectedCourse.progress || 0) + 25, 100);
                      updateProgress(selectedCourse.id, newProgress);
                    }
                  }}
                >
                  Mark +25% Progress
                </Button>
                {selectedCourse?.url && (
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => window.open(selectedCourse.url!, '_blank')}
                  >
                    Start Course
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
