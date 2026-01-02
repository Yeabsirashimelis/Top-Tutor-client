"use client";

import { useState } from "react";
import { Download, Share2, CheckCircle, Award, Calendar, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface Certificate {
  _id: string;
  certificateNumber: string;
  issuedDate: string;
  completionDate: string;
  grade: string;
  finalScore: number;
  verificationCode: string;
  course: {
    title: string;
    coverImage?: string;
  };
  instructorName: string;
  courseDuration: number;
}

interface CertificateViewerProps {
  certificates: Certificate[];
}

export default function CertificateViewer({ certificates }: CertificateViewerProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  if (!certificates || certificates.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-500">
            Complete courses to earn certificates and showcase your achievements!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card
            key={cert._id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setSelectedCert(cert)}
          >
            <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Award className="w-20 h-20 text-white/20 absolute" />
              <div className="relative text-center">
                <CheckCircle className="w-12 h-12 text-white mx-auto mb-2" />
                <p className="text-white font-bold">Certificate</p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {cert.course.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(cert.issuedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Grade: {cert.grade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{cert.instructorName}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="border-8 border-indigo-600 p-8 relative">
              {/* Certificate Design */}
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Award className="w-24 h-24 text-indigo-600" />
                </div>

                <div>
                  <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
                    Certificate of Completion
                  </h1>
                  <div className="w-32 h-1 bg-indigo-600 mx-auto"></div>
                </div>

                <p className="text-gray-600">This certifies that</p>

                <h2 className="text-3xl font-bold text-indigo-600">
                  [Student Name]
                </h2>

                <p className="text-gray-600">has successfully completed</p>

                <h3 className="text-2xl font-semibold text-gray-800">
                  {selectedCert.course.title}
                </h3>

                <div className="grid grid-cols-2 gap-8 pt-6">
                  <div>
                    <p className="text-sm text-gray-500">Completion Date</p>
                    <p className="font-semibold">
                      {new Date(selectedCert.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-semibold">{selectedCert.grade}</p>
                  </div>
                </div>

                <div className="pt-6 border-t mt-6">
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-semibold">{selectedCert.instructorName}</p>
                </div>

                <div className="text-xs text-gray-400 pt-4">
                  <p>Certificate Number: {selectedCert.certificateNumber}</p>
                  <p>Verification Code: {selectedCert.verificationCode}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
