import {
  useEffect,
  useState,
} from "react";

import { authApi } from "../services/api";

type Subscription = {
  id: number;
  organization_id: number;
  plan_name: string;
  max_users: number;
  status: string;
};

function Subscriptions() {
  const [
    subscriptions,
    setSubscriptions,
  ] = useState<
    Subscription[]
  >([]);

  const loadData =
    async () => {
      const response =
        await authApi.get(
          "/subscriptions"
        );

      setSubscriptions(
        response.data
      );
    };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h1>
        Subscriptions
      </h1>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Org ID</th>
              <th>Plan</th>
              <th>Max Users</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map(
              (
                subscription
              ) => (
                <tr
                  key={
                    subscription.id
                  }
                >
                  <td>
                    {
                      subscription.id
                    }
                  </td>

                  <td>
                    {
                      subscription.organization_id
                    }
                  </td>

                  <td>
                    {
                      subscription.plan_name
                    }
                  </td>

                  <td>
                    {
                      subscription.max_users
                    }
                  </td>

                  <td>
                    {
                      subscription.status
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Subscriptions;