'use client';

import { useState } from 'react';
import { Upload, Bus, FileText, Download } from 'lucide-react';
import { BoardingSequence } from '@/lib/boarding-algorithm';

interface SequenceResult {
  seq: number;
  bookingId: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [sequence, setSequence] = useState<SequenceResult[] | null>(null);
  const [details, setDetails] = useState<BoardingSequence[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSequence(null);
      setDetails(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/boarding-sequence', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      setSequence(data.sequence);
      setDetails(data.details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadSequence = () => {
    if (!sequence) return;

    // Match exact output format: "Seq   Booking_ID" with tab separation
    const content = `Seq\tBooking_ID\n${sequence.map(s => `${s.seq}\t${s.bookingId}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boarding_sequence.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <Bus className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Bus Boarding Sequence Generator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg px-2">
            Generate optimal boarding sequence for maximum boarding efficiency
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {/* Left Column - File Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-5 lg:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg lg:text-xl">Upload Booking Data</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select File (Text format)
                </label>
                <div className="mt-1 flex justify-center px-3 sm:px-4 lg:px-6 pt-4 sm:pt-5 pb-4 sm:pb-5 lg:pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center w-full">
                    <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
                    <div className="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-600 dark:text-gray-400 items-center justify-center gap-1 sm:gap-0">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".txt,.csv"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="sm:pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      TXT, CSV up to 10MB
                    </p>
                    {file && (
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2 break-all px-2">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Bus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Generate Sequence</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Sample Format */}
            <div className="mt-4 sm:mt-5 lg:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Expected File Format:
              </h3>
              <pre className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-mono overflow-x-auto">
{`Booking_ID    Seats
101   A1,B1
120   A20,C2`}
              </pre>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg lg:text-xl">Boarding Sequence</span>
              </h2>
              {sequence && (
                <button
                  onClick={downloadSequence}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>

            {!sequence ? (
              <div className="text-center py-8 sm:py-10 lg:py-12 text-gray-500 dark:text-gray-400">
                <Bus className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Upload a file to generate boarding sequence</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {/* Sequence Table */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle sm:block">
                    <table className="w-full border-collapse min-w-[300px]">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-left font-semibold text-xs sm:text-sm">
                            Seq
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-left font-semibold text-xs sm:text-sm">
                            Booking_ID
                          </th>
                          {details && (
                            <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-left font-semibold text-xs sm:text-sm hidden md:table-cell">
                              Seats
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {sequence.map((item) => (
                          <tr
                            key={item.seq}
                            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                              {item.seq}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                              {item.bookingId}
                            </td>
                            {details && (
                              <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden md:table-cell">
                                {details.find(d => d.bookingId === item.bookingId)?.seats.join(', ')}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bus Layout Visualization */}
                {details && <BusLayoutVisualization details={details} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bus Layout Visualization Component
function BusLayoutVisualization({ details }: { details: BoardingSequence[] }) {
  // Group seats by row and position
  const seatMap = new Map<string, { row: string; position: number; bookingId: string; seq: number }>();
  details.forEach(d => {
    d.seats.forEach(seat => {
      const match = seat.match(/^([A-Z])(\d+)$/);
      if (match) {
        seatMap.set(seat, {
          row: match[1],
          position: parseInt(match[2], 10),
          bookingId: d.bookingId,
          seq: d.seq,
        });
      }
    });
  });

  // Get max position
  const maxPosition = Math.max(...Array.from(seatMap.values()).map(s => s.position), 1);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
        Bus Layout Visualization
      </h3>
      <div className="space-y-1.5 sm:space-y-2 overflow-x-auto">
        {/* Back of bus label */}
        {maxPosition > 5 && (
          <div className="text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2 font-semibold">
            ← Back of Bus
          </div>
        )}
        
        {/* Seats grid - showing A/B on left, C/D on right */}
        <div className="space-y-0.5 sm:space-y-1 min-w-[280px] sm:min-w-0">
          {Array.from({ length: maxPosition }, (_, i) => maxPosition - i).map(position => {
            const leftSeats = ['A', 'B'];
            const rightSeats = ['C', 'D'];
            
            return (
              <div key={position} className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                {/* Left side (A, B) */}
                <div className="flex gap-0.5 sm:gap-1 flex-1">
                  {leftSeats.map(row => {
                    const seat = `${row}${position}`;
                    const seatInfo = seatMap.get(seat);
                    const isOccupied = !!seatInfo;
                    
                    return (
                      <div
                        key={seat}
                        className={`flex-1 p-1 sm:p-1.5 lg:p-2 rounded text-center text-[10px] sm:text-xs font-medium ${
                          isOccupied
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                        }`}
                        title={isOccupied ? `Seq ${seatInfo.seq}: Booking ${seatInfo.bookingId}` : 'Empty'}
                      >
                        {seat}
                      </div>
                    );
                  })}
                </div>
                
                {/* Aisle indicator */}
                <div className="w-4 sm:w-6 lg:w-8 text-center text-[10px] sm:text-xs text-gray-400">
                  {position === 1 && '🚶'}
                </div>
                
                {/* Right side (C, D) */}
                <div className="flex gap-0.5 sm:gap-1 flex-1">
                  {rightSeats.map(row => {
                    const seat = `${row}${position}`;
                    const seatInfo = seatMap.get(seat);
                    const isOccupied = !!seatInfo;
                    
                    return (
                      <div
                        key={seat}
                        className={`flex-1 p-1 sm:p-1.5 lg:p-2 rounded text-center text-[10px] sm:text-xs font-medium ${
                          isOccupied
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                        }`}
                        title={isOccupied ? `Seq ${seatInfo.seq}: Booking ${seatInfo.bookingId}` : 'Empty'}
                      >
                        {seat}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Front entry and blocking info */}
        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
          <div className="text-center p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded text-xs sm:text-sm font-semibold text-green-800 dark:text-green-200">
            🚪 Front Entry (Single Entry Point)
          </div>
          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 p-1.5 sm:p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <p className="font-semibold mb-0.5 sm:mb-1">Blocking Constraint:</p>
            <p className="leading-tight">If passenger X is standing in the aisle, passenger Y behind cannot cross. Boarding furthest seats first minimizes blocking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

