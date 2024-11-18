import { Page } from "@dynatrace/strato-components-preview";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Scenario } from "./pages/Scenario";
import { Details } from "./pages/Details";
import { ServiceFlowCard } from "./pages/ServiceFlowCard";
import { useNavigate } from 'react-router-dom';

export const App = () => {

  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<Scenario />} />
          <Route path="/Details" element={<Details />} />
          <Route path="/ServiceFlowCard" element={<ServiceFlowCard />} />
        </Routes>
      </Page.Main>
    </Page>
  );
};
