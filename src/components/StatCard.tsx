import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function StatCard({ title, icon, children, footer }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-lg font-normal text-[#232323]">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-8">{children}</CardContent>
      {footer && <CardFooter className="flex justify-end">{footer}</CardFooter>}
    </Card>
  );
}
