import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ResourceListForAccessories from "../../components/ResourceListForAccessories";

const AccessorySetPage: React.FC = () => {
  const img =
    "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

  // State
  const [set, setSet] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  // Load data from server
  useEffect(() => {
    if (id) {
      // Gotta check this because id will be undefined on first render
      console.log("This is the id: ", id);
      axios.post(`/api/accessorySets/get`, { id: id }).then((res) => {
        setSet(res.data[0]);
        console.log("Post get: ", res);
      });
    }
  }, [id]);

  const emptyState = (
    <EmptyState
      heading="Add accessory sets to display to your customers"
      image={img}
      action={{
        content: "Add Set",
        onAction: () => setPickerOpen(true),
      }}
    >
      <p> Help your customers buy what they need</p>
    </EmptyState>
  );

  return (
    <Page>
      <TitleBar
        title="Add Accessories"
        primaryAction={{
          content: "Add accessories",
          onAction: () => setPickerOpen(true),
        }}
      />
      <Layout>
        <Layout.Section>
          {!set || set.accessories.length === 0 ? (
            emptyState
          ) : (
            <ResourceListForAccessories set={set} setSet={setSet} />
          )}
        </Layout.Section>
      </Layout>
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={pickerOpen}
        onSelection={(resources) => addAccessories(resources)}
        onCancel={() => setPickerOpen(false)}
      />
    </Page>
  );

  async function addAccessories(resources) {
    const newIds = resources.selection.map((sel) => sel.id);
    const existingIds = set.accessories.map((acc) => acc.pid);
    const res = await axios.post(`/api/accessorySets/update`, {
      id: set.id,
      accessories: newIds.concat(existingIds),
    });
    console.log("Res: ", res);
    setSet(res.data);
    setPickerOpen(false);
  }
};

export default AccessorySetPage;
