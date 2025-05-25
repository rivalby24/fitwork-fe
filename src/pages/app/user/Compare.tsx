import React, { useState, useEffect } from "react";
import { securedApi } from "@/lib/api";
import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Session {
  id: string;
  company: string;
  company_name: string; // alias for display
  created_at: string;
  overall_score: number;
}

interface CompareResultSide {
  session_id: string;
  company: string;
  created_at: string;
  overall_score: number;
  dimension_scores: Record<string, number>;
}

interface CompareResult {
  session1: CompareResultSide;
  session2: CompareResultSide;
}

export default function Compare() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [firstSessionId, setFirstSessionId] = useState<string>("");
  const [secondSessionId, setSecondSessionId] = useState<string>("");
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Load user’s sessions
  useEffect(() => {
    const fetchSessions = async () => {
      setError(null);
      setLoading(true);
      try {
        const resp = await securedApi.get<Session[]>("/api/v1/assessments/sessions/");
        const data = resp.data;
        setSessions(data);

        if (data.length >= 2) {
          setFirstSessionId(data[0].id);
          setSecondSessionId(data[1].id);
        }
      } catch {
        setError("Failed to load your assessment sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // 2) Fetch comparison whenever session IDs change
  useEffect(() => {
    const fetchComparison = async () => {
      if (!firstSessionId || !secondSessionId) return;
      setError(null);
      setLoading(true);
      try {
        const res = await securedApi.get<CompareResult>("/api/v1/assessments/compare/", {
          params: { s1: firstSessionId, s2: secondSessionId },
        });
        setCompareResult(res.data);
      } catch {
        setError("Failed to compare these assessments.");
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [firstSessionId, secondSessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (sessions.length < 2) {
    return (
      <div className="text-center py-4">
        You need at least two completed assessments to compare.
      </div>
    );
  }

  return (
    <main className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl mb-8">Assessment Comparison</h2>

        {/* Session selectors */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {["First Assessment", "Second Assessment"].map((label, idx) => (
            <div key={label} className="flex-1">
              <label className="block mb-2 font-medium">
                {label}
              </label>
              <select
                className="w-full border rounded px-4 py-2"
                value={idx === 0 ? firstSessionId : secondSessionId}
                onChange={(e) =>
                  idx === 0
                    ? setFirstSessionId(e.target.value)
                    : setSecondSessionId(e.target.value)
                }
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company_name} —{" "}
                    {new Date(s.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Comparison cards */}
        {compareResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(["session1", "session2"] as const).map((key) => {
              const side = compareResult[key];
              return (
                <Card key={side.session_id} className="shadow">
                  <CardContent>
                    <h3 className="text-xl font-semibold">{side.company}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Taken on{" "}
                      {new Date(side.created_at).toLocaleString()}
                    </p>
                    <p className="mb-4">
                      <strong>Overall Score:</strong> {side.overall_score}
                    </p>
                    <div className="space-y-2">
                      {Object.entries(side.dimension_scores).map(
                        ([dim, score]) => (
                          <div
                            key={dim}
                            className="flex justify-between border-b pb-1"
                          >
                            <span>{dim}</span>
                            <span>{score}</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
