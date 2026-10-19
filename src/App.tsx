import React, { useState } from "react";
import { checkIdentifierExists, storeIdentifier } from "@/storage"; "./src/storage";
import { CanvasBranchy, type BranchStyle } from "./components/CanvasBranchy";
import { BidirectionalBridge } from "./components/BidirectionalBridge";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

export default function App() {
  const [inputVal, setInputVal] = useState<string>("SIIRI");
  const [viewMode, setViewMode] = useState<
    "branchy" | "branchy-small" | "branchy-xsmall" | "2way"
  >("branchy");
  const [branchStyle, setBranchStyle] = useState<BranchStyle>("knotty");

  const saveId = (value: string) => {
  // Clean and transform the input string
  const ucaseid = value.trim().toUpperCase();

  // Bottom value check: Block empty strings or pure spaces
  if (!ucaseid) {
    console.error("Validation failed: Identifier string cannot be empty.");
    // Add toast or warning state here if needed
    return;
  }

  // Top value check: Ensure value does not exceed maximum allowable payload lengths
  if (ucaseid.length > 9) {
    console.error("Validation failed: Identifier strings must not exceed 9 characters.");
    return;
  }

  // Execution boundary: Code safely runs when bounds are satisfied
  console.log("Saving verified identifier:", ucaseid);
  // Execute your endpoint saving sequence or state persistence layers here...
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toUpperCase().slice(0, 9);
    setInputVal(cleaned);
  };

/* 
  const saveId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ucaseid = e.target.value.toUpperCase();

        const cleanName = 'RISUKKO'.slice(0, 9);
        const canvasSize =  512;
        const padding =  32;
        const variant =  0x02; 
        const style =  0x01;     

        // Pack into 14-byte binary buffer
        const encoder = new TextEncoder();
        const nameBytes = encoder.encode(cleanName);
        
        const buffer = new Uint8Array(14);
        buffer.set(nameBytes, 0);

        //console.log(buffer);
        
        const view = new DataView(buffer.buffer);
        view.setUint16(9, canvasSize);
        view.setUint8(11, padding);
        buffer[12] = variant;
        buffer[13] = style;


    storeIdentifier(ucaseid, new )
    console.log(inputVal || '');
  }; */

  const is2Way = viewMode === "2way";
  const modes = [
    { id: "branchy", label: "Branch" },
    { id: "branchy-small", label: "Small" },
    { id: "branchy-xsmall", label: "X-small" },
    { id: "2way", label: "2-way" },
  ] as const;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-[#f78522] shadow-[0_0_8px_#f78522]" aria-hidden="true" />
            <div>
              <h1 className="text-sm font-semibold tracking-wide">PROJECT RISUKKO</h1>
              {/* <p className="mt-0.5 text-xs text-muted-foreground">Prototype</p> */}
            </div>
          </div>
{/*           <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 sm:inline-flex">
            Visual identity studio
          </span> */}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="space-y-5">
          <Card>
            <CardContent className="space-y-6 p-5 sm:p-6">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Identifier input</h2>
                <p className="mt-1 text-sm text-muted-foreground">Create a visual from up to nine characters.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" htmlFor="identity-string">
                  Identifier string
                </label>
                <Input
                  id="identity-string"
                  maxLength={9}
                  onChange={handleInputChange}
                  placeholder="ENTER STRING"
                  value={inputVal}
                  aria-describedby="identity-count"
                  className="h-12 text-center font-mono text-lg tracking-[0.3em] uppercase"
                />
                <div id="identity-count" className="flex justify-between text-xs text-muted-foreground">
                  <span></span>
                  <span>Characters: {inputVal.length} / 9</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">View mode</h3>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="View mode">
                  {modes.map((mode) => (
                    <Button
                      key={mode.id}
                      aria-pressed={viewMode === mode.id}
                      className="w-full"
                      onClick={() => setViewMode(mode.id)}
                      size="sm"
                      variant={viewMode === mode.id ? "default" : "outline"}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </div>
              </div>

              {viewMode.startsWith("branchy") && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Branch style</h3>
                  <div className="grid grid-cols-1 gap-2" role="group" aria-label="Branch style">
                    {(
                      [
                        { id: "knotty", label: "Knotty branch" },
                        { id: "thin", label: "Ultra thin" },
                        { id: "steel", label: "Steel frame" },
                      ] as const
                    ).map((style) => (
                      <Button
                        key={style.id}
                        aria-pressed={branchStyle === style.id}
                        className="justify-start"
                        onClick={() => setBranchStyle(style.id)}
                        size="sm"
                        variant={branchStyle === style.id ? "secondary" : "ghost"}
                      >
                        <span className={`mr-2 size-2 rounded-full ${branchStyle === style.id ? "bg-primary" : "bg-slate-300"}`} aria-hidden="true" />
                        {style.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


        </aside>

        <section className="min-w-0 space-y-4">
{/*  
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Workspace</p>
               <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Identifier visualizer</h2>
            </div>
           <p className="text-sm text-muted-foreground">
              {is2Way ? "Forward and reverse mapping" : `${viewMode.replace("branchy-", "").replace("branchy", "branch").toUpperCase()} render`}
            </p> 
          </div>*/}

          <Card className="border-blue-100 bg-blue-50/70 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Identifier preview</p>
              <p className="mt-2 break-all font-mono text-lg font-semibold tracking-[0.2em] text-blue-700">
                {inputVal || "—"}
              </p>
            </CardContent>
          </Card>

          {is2Way ? (
            <BidirectionalBridge text={inputVal} />
          ) : (
            <VisualizerCard
              title="Graph 8x8"
              subtitle={`${branchStyle} · ${viewMode === "branchy" ? "normal" : viewMode === "branchy-small" ? "small" : "x-small"}`}
            >
              <CanvasBranchy
                text={inputVal}
                branchStyle={branchStyle}
                scale={viewMode === "branchy" ? "normal" : viewMode === "branchy-small" ? "small" : "xsmall"}
              />
            </VisualizerCard>
          )}



          <Card className="border-blue-100 bg-blue-50/70 shadow-none">
            <CardContent className="p-4">
              <div>
              {/* <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">SAVE</p>
              <h2 className="text-base font-semibold tracking-tight">Save As My Identidier</h2> */}

                    <Button
                      key="save-identifier-btn"
                      className="w-full"
                      onClick={() => saveId(inputVal)} // Pass the string value directly
                      //size="l"
                    >
                      Save As My Identifier
                    </Button>
              </div>
              
            </CardContent>
          </Card>



        </section>
      </div>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:px-6 md:flex-row md:justify-between lg:px-8">
          <span>All rights reserved. &copy;Risto Ikonen 2026.  Design Curation: Henri Ikonen </span>
          <span>Graph is a lossless text container.</span>
        </div>
      </footer>
    </main>
  );
}

function VisualizerCard({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {subtitle}
        </span>
      </div>
      <CardContent className="flex min-h-[340px] items-center justify-center bg-slate-50/70 p-4 sm:p-6">
        {children}
      </CardContent>
    </Card>
  );
}