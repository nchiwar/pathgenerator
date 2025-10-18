import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, TrendingUp, ExternalLink } from "lucide-react";
import { Course } from "@/stores/learningPathStore";

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
  onUpdateProgress: (courseId: string, progress: number) => void;
}

export const CourseCard = ({ course, onViewDetails, onUpdateProgress }: CourseCardProps) => {
  const progress = course.progress || 0;
  
  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-secondary text-secondary-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group p-6 hover:shadow-primary transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-border/50 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                {course.difficulty || 'N/A'}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {course.phase}
              </Badge>
            </div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            {course.provider && (
              <p className="text-sm text-muted-foreground mt-1">by {course.provider}</p>
            )}
          </div>
          <BookOpen className="w-6 h-6 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>

        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {course.duration_weeks && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration_weeks} weeks</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{progress}% complete</span>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(course)}
            >
              View Details
            </Button>
            {course.url && (
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => window.open(course.url!, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Start Course
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
