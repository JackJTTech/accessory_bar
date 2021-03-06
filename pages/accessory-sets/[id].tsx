import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Frame,
  Icon,
  Layout,
  Link,
  Loading,
  Page,
  Stack,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ResourceListForAccessories from "../../components/ResourceListForAccessories";
import accessoriesFromResources from "../../utils/frontend/accessoriesFromResources";
import { MobileBackArrowMajor } from "@shopify/polaris-icons";

const AccessorySetPage: React.FC = () => {
  const img =
    "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

  // State
  const [set, setSet] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;
  // Load data from server
  useEffect(() => {
    if (id) {
      // Gotta check this because id will be undefined on first render
      console.log("This is the id: ", id);
      axios.post(`/api/accessorySets/get`, { id: id }).then((res) => {
        setSet(res.data);
        console.log("Post get: ", res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading)
    return (
      <Page>
        <Frame>
          <Loading />
        </Frame>
      </Page>
    );

  const emptyState = (
    <EmptyState
      heading="Add accessory sets to display to your customers"
      image={img}
      action={{
        content: "Add Accessories",
        onAction: () => setPickerOpen(true),
      }}
    >
      <p> Help your customers buy what they need</p>
    </EmptyState>
  );

  return (
    <Page
      breadcrumbs={[
        {
          content: "Accessory Sets",
          url: "/accessory-sets",
        },
      ]}
      primaryAction={{
        content: "Add Accessories",
        onAction: () => setPickerOpen(true),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Header title={set.baseProduct.title} />
            <Card.Section>
              <Stack>
                <Thumbnail
                  source={set.baseProduct.img}
                  alt={"Image of " + set.baseProduct.title}
                />
                <Stack vertical alignment="trailing">
                  <TextStyle variation="subdued">Impressions</TextStyle>
                  <TextStyle variation="strong">{set.impressions}</TextStyle>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
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
    const newAccessories = accessoriesFromResources(resources);
    const existingAccessories = set.accessories;
    const res = await axios.post(`/api/accessorySets/update`, {
      id: set.id,
      accessories: newAccessories.concat(existingAccessories),
    });
    console.log("Res: ", res);
    setSet(res.data);
    setPickerOpen(false);
  }
};

export default AccessorySetPage;
