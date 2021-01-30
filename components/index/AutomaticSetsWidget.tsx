import { Card, Layout, SettingToggle } from "@shopify/polaris";
import Axios from "axios";
import React, { useState } from "react";

const AutomaticSetsWidget: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  const contentStatus = enabled ? "Disable" : "Enable";
  return (
    <Layout.AnnotatedSection
      title="Automatic Accessories"
      description="Automatically serve accessories for all products"
    >
      <Card>
        <SettingToggle
          enabled={enabled}
          action={{ content: contentStatus, onAction: handleToggle }}
        >
          Automatic Accessories in turned {enabled ? "On" : "Off"}
        </SettingToggle>
      </Card>
    </Layout.AnnotatedSection>
  );

  async function handleToggle() {
    await Axios.post("/api/automaticSets/setEnabled", { enabled: !enabled });
    setEnabled(!enabled);
  }
};

export default AutomaticSetsWidget;