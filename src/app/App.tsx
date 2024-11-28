import { Page } from "@dynatrace/strato-components-preview";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { CycleRun } from "./pages/CycleRun";
import { Details } from "./pages/Details";
import { DocProvider } from "./components/DocProvider";
import { LandingPage } from "./pages/LandingPage";

export const App = () => {

  return (
      <Page>
        <DocProvider>
          <Page.Header>
            <Header />
          </Page.Header>
          <Page.Main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/CycleRun" element={<CycleRun />} />
              <Route path="/Details" element={<Details />} />
            </Routes>
          </Page.Main>
        </DocProvider>
      </Page>
  );
};
