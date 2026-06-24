import {
  useEffect,
  useState,
} from "react";

import { authApi } from "../services/api";

type Organization = {
  id: number;
  name: string;
  plan: string;
  status: string;
};

function Organizations() {
  const [items, setItems] =
    useState<
      Organization[]
    >([]);

  const [name, setName] =
    useState("");

  const [plan, setPlan] =
    useState("FREE");

  const loadData =
    async () => {
      const response =
        await authApi.get(
          "/organizations"
        );

      setItems(
        response.data
      );
    };

  useEffect(() => {
    loadData();
  }, []);

  const createOrg =
    async () => {
      await authApi.post(
        "/organizations",
        {
          name,
          plan,
        }
      );

      setName("");

      loadData();
    };

  return (
    <>
      <h1>
        Organizations
      </h1>

      <div className="card">
        <input
          placeholder="Organization Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <select
          value={plan}
          onChange={(e) =>
            setPlan(
              e.target.value
            )
          }
        >
          <option>
            FREE
          </option>

          <option>
            BASIC
          </option>

          <option>
            PREMIUM
          </option>

          <option>
            ENTERPRISE
          </option>
        </select>

        <br />
        <br />

        <button
          onClick={
            createOrg
          }
        >
          Create
          Organization
        </button>
      </div>

      <br />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Plan</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map(
              (item) => (
                <tr
                  key={
                    item.id
                  }
                >
                  <td>
                    {item.id}
                  </td>

                  <td>
                    {
                      item.name
                    }
                  </td>

                  <td>
                    {
                      item.plan
                    }
                  </td>

                  <td>
                    {
                      item.status
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

export default Organizations;