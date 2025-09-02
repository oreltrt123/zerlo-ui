"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import "@/styles/button.css";

interface AnalyticsData {
  page_views: number;
  unique_visitors: number;
  last_updated: string;
}

interface Component {
  message_id: string;
  content: string;
  component_code: string;
  deployed?: {
    id: string;
    site_name: string;
    message_content: string;
    component_code: string;
    analytics?: AnalyticsData;
  };
}

interface AnalyticsSettingsProps {
  chatId: string;
}

const getStatusBadge = (status: "deployed" | "not_deployed") => {
  switch (status) {
    case "deployed":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Deployed
        </Badge>
      );
    case "not_deployed":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Not Deployed
        </Badge>
      );
    default:
      return null;
  }
};

export default function AnalyticsSettings({ chatId }: AnalyticsSettingsProps) {
  const [components, setComponents] = useState<Component[]>([]);
  const [deployingMessageId, setDeployingMessageId] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  const loadComponents = useCallback(async () => {
    try {
      const response = await fetch(`/api/components/${chatId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch components");
      }
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error("Error loading components:", error);
      toast.error("Error loading data");
    }
  }, [chatId]);

  useEffect(() => {
    loadComponents();
  }, [loadComponents]);

  const handleStartDeploy = (messageId: string) => {
    setDeployingMessageId(messageId);
    setSiteName("");
  };

  const handleCancelDeploy = () => {
    setDeployingMessageId(null);
    setSiteName("");
  };

  const handleDeploy = async () => {
    if (!siteName.trim()) {
      toast.error("Please enter a site name");
      return;
    }

    const siteNameRegex = /^[a-zA-Z0-9-]+$/;
    if (!siteNameRegex.test(siteName)) {
      toast.error("Site name can only contain letters, numbers, and hyphens");
      return;
    }

    const comp = components.find((c) => c.message_id === deployingMessageId);
    if (!comp || !comp.component_code) {
      toast.error("Component not found");
      return;
    }

    setIsDeploying(true);

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          componentCode: comp.component_code,
          messageId: comp.message_id,
          chatId,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to deploy site");
      }

      toast.success(`Site deployed successfully! Visit: ${siteName}.zerlo.online`);
      handleCancelDeploy();
      await loadComponents();
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Failed to deploy site. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Settings for {chatId}</CardTitle>
          <CardDescription>Manage deployments and view analytics for components in chat {chatId}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Components ({components.length})</CardTitle>
          <CardDescription>Publish components to the internet and view their analytics</CardDescription>
        </CardHeader>
        <CardContent>
          {components.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No components created in this chat.</p>
              <p className="text-sm">Create components in the chat to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Page Views</TableHead>
                  <TableHead>Unique Visitors</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((comp) => (
                  <TableRow key={comp.message_id}>
                    <TableCell className="font-medium">
                      <span className="line-clamp-2">{comp.content}</span>
                    </TableCell>
                    <TableCell>
                      {comp.deployed ? (
                        <a
                          href={`https://${comp.deployed.site_name}.zerlo.online`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {comp.deployed.site_name}.zerlo.online
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(comp.deployed ? "deployed" : "not_deployed")}</TableCell>
                    <TableCell>{comp.deployed?.analytics?.page_views ?? "-"}</TableCell>
                    <TableCell>{comp.deployed?.analytics?.unique_visitors ?? "-"}</TableCell>
                    <TableCell>
                      {comp.deployed?.analytics ? new Date(comp.deployed.analytics.last_updated).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      {comp.deployed ? (
                        <span className="text-sm text-muted-foreground">Deployed</span>
                      ) : deployingMessageId === comp.message_id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value.toLowerCase())}
                            placeholder="site-name"
                            className="w-32"
                            disabled={isDeploying}
                          />
                          <Button
                            onClick={handleDeploy}
                            disabled={isDeploying || !siteName.trim()}
                            size="sm"
                            className="bg-[#0099FF] hover:bg-[#0099ffde] text-white r2552esf25_252trewt3erblueFontDocs"
                          >
                            {isDeploying ? "Deploying..." : "Deploy"}
                          </Button>
                          <Button
                            onClick={handleCancelDeploy}
                            variant="outline"
                            size="sm"
                            disabled={isDeploying}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleStartDeploy(comp.message_id)}
                          size="sm"
                          className="bg-[#0099FF] hover:bg-[#0099ffde] text-white r2552esf25_252trewt3erblueFontDocs"
                        >
                          Publish
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}