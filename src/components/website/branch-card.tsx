"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";

interface BranchCardProps {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export function BranchCard({ name, address, phone, email }: BranchCardProps) {
  return (
    <Card className="border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary mb-2">{name}</h3>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm leading-relaxed">{address}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-5 h-5 text-primary shrink-0" />
            <a 
              href={`tel:${phone}`}
              className="text-sm hover:text-primary transition-colors"
            >
              {phone}
            </a>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <a 
              href={`mailto:${email}`}
              className="text-sm hover:text-primary transition-colors break-all"
            >
              {email}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

