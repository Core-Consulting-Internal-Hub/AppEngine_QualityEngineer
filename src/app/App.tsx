import { Page } from "@dynatrace/strato-components-preview";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { CycleRun } from "./pages/CycleRun";
import { Details } from "./pages/Details";
import { ServiceFlowCard } from "./pages/ServiceFlowCard";
import { SuccessCriteriaProvider } from "./components/SuccessCriteriaContext";

export const App = () => {

  return (
    <SuccessCriteriaProvider>
      <Page>
        <Page.Header>
          <Header />
        </Page.Header>
        <Page.Main>
          <Routes>
            <Route path="/" element={<CycleRun />} />
            <Route path="/Details" element={<Details />} />
            <Route path="/ServiceFlowCard" element={<ServiceFlowCard />} />
          </Routes>
        </Page.Main>
      </Page>
    </SuccessCriteriaProvider>
  );
};
