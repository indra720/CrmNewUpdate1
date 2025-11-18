import { ReactNode } from "react";

export async function toggleUserActiveStatus(
  userId: number,
  userType: string,
  isActive: boolean
): Promise<void> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const requestData = {
    user_id: userId,
    user_type: userType,
    is_active: isActive,
  };

  console.log("=== TOGGLE API CALL ===");
  console.log("Request Data:", requestData);
  console.log(
    "API URL:",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/toggle-active/`
  );
  console.log("Request Body:", JSON.stringify(requestData));

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/toggle-active/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    console.log("API Response Status:", response.status);
    console.log("API Response OK:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("API Error Response:", errorData);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    console.log("=== TOGGLE API SUCCESS ===");
    // No need to return anything specific, just resolve if successful
  } catch (error: any) {
    console.error("=== TOGGLE API ERROR ===");
    console.error("Failed to toggle user status:", error);
    throw new Error(
      `Failed to toggle user status: ${error.message || "Unknown error"}`
    );
  }
}

// Funtion to fetch admin leads by tag because it's a same api call as the one used in the AdminLeadTable component.
export async function fetchAdminLeadsByTag(
  tag: string
): Promise<{ staff_leads: any[]; team_leads: any[] }> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/admin-leads/${tag}/`;
    console.log("Fetching URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Failed to fetch leads for tag ${tag}:`, error);
    throw new Error(
      `Failed to fetch leads: ${error.message || "Unknown error"}`
    );
  }
}

export async function updateLeadStatusAndFollowUp(
  leadId: number,
  status: string,
  message: string,
  followUpDate: string,
  followUpTime: string
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/update-lead-status/${leadId}/`,
      {
        method: "PATCH", // Assuming PATCH for partial update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          status: status,
          message: message,
          follow_up_date: followUpDate,
          follow_up_time: followUpTime,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `Failed to update lead ${leadId} status and follow-up:`,
      error
    );
    throw new Error(
      `Failed to update lead status and follow-up: ${
        error.message || "Unknown error"
      }`
    );
  }
}

//  Funciton to fethch all admins cards
export async function fetchAdmins(): Promise<any[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.users || [];
  } catch (error: any) {
    console.error("Failed to fetch admins:", error);
    throw new Error(
      `Failed to fetch admins: ${error.message || "Unknown error"}`
    );
  }
}

//  function to fetch superuser staff leads by tag.
export async function fetchSuperuserStaffLeadsByTag(tag: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/superuser/staff-leads/${tag}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `Failed to fetch superuser staff leads for tag ${tag}:`,
      error
    );
    throw new Error(
      `Failed to fetch superuser staff leads: ${
        error.message || "Unknown error"
      }`
    );
  }
}

// function to fetch teamleader edit api call.
export async function editTeamLeader(id: number, formData: any): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/team-leader/edit/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Failed to edit team leader:", error);
    throw new Error(
      `Failed to edit team leader: ${error.message || "Unknown error"}`
    );
  }
}

export async function fetchSuperuserTeamLeaderLeadsByTag(
  tag: string
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/team-leader-leads/${tag}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `Failed to fetch superuser team leader leads for tag ${tag}:`,
      error
    );
    throw new Error(
      `Failed to fetch superuser team leader leads: ${
        error.message || "Unknown error"
      }`
    );
  }
}

export async function fetchSuperuserFreelancerLeadsByTag(
  tag: string
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/freelancer-leads/${tag}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `Failed to fetch superuser freelancer leads for tag ${tag}:`,
      error
    );
    throw new Error(
      `Failed to fetch superuser freelancer leads: ${
        error.message || "Unknown error"
      }`
    );
  }
}

export async function fetchAdminsForSelection(): Promise<any[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error: any) {
    console.error("Failed to fetch admins:", error);
    throw new Error(
      `Failed to fetch admins: ${error.message || "Unknown error"}`
    );
  }
}

export async function fetchTeamLeaders(): Promise<any[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/get-team-leaders/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error: any) {
    console.error("Failed to fetch team leaders:", error);
    throw new Error(
      `Failed to fetch team leaders: ${error.message || "Unknown error"}`
    );
  }
}

// Function to fetch interested leads
export async function fetchInterestedLeads(): Promise<InterestedLeadsResponse> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-customer/interested/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Failed to fetch interested leads:", error);
    throw new Error(
      `Failed to fetch interested leads: ${error.message || "Unknown error"}`
    );
  }
}

interface AssignedTo {
  id: number;
  name: string;
  staff_id: string;
  email: string;
  mobile: string;
}

export interface Lead {
  dateTime: ReactNode;
  team_leader: any;
  id: number;
  name: string;
  email: string;
  call: string;
  send: string | null;
  status: string;
  message: string;
  follow_up_date: string | null;
  follow_up_time: string | null;
  created_date: string;
  assigned_to: AssignedTo;
}

// lead histor api call. for leads-report/interested page
interface InterestedLeadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

export interface LeadHistoryEntry {
  id: number;
  lead_id: number;
  status: string;
  message: string;
  created_date: string;
  updated_date: string;
  leads: number;
}

export async function fetchLeadHistory(
  leadId: string
): Promise<LeadHistoryEntry[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leads-history/?lead_id=${leadId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    if (result.status && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to fetch lead history.");
    }
  } catch (error: any) {
    console.error(`Failed to fetch history for lead ${leadId}:`, error);
    throw new Error(
      `Failed to fetch lead history: ${error.message || "Unknown error"}`
    );
  }
}

// users ke pages ke card ke liye api

export async function fetchLeadsForSuperuser(
  tag: string,
  source: string | null
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  let endpoint = "";

  switch (source) {
    case "admin":
      endpoint = `/accounts/api/admin-leads/${tag}/`;

      break;

    case "team-leader":
      endpoint = `/accounts/api/superuser/team-leader-leads/${tag}/`;

      break;

    case "staff":
      endpoint = `/accounts/superuser/staff-leads/${tag}/`;

      break;

    case "associate":
      endpoint = `/accounts/api/superuser/freelancer-leads/${tag}/`;

      break;

    default:
      // Fallback or error

      throw new Error(`Invalid source for fetching leads: ${source}`);
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

    console.log(`Fetching URL for source ${source}:`, url);

    const response = await fetch(
      url,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `Failed to fetch leads for tag ${tag} and source ${source}:`,
      error
    );

    throw new Error(
      `Failed to fetch leads: ${error.message || "Unknown error"}`
    );
  }
}

// pending,today and tomorrow  and interested ka page

export async function fetchLeadsForStaff(tag: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const endpoint = `/accounts/staff/leads/${tag}/`;

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

    console.log(`Fetching URL for staff leads:`, url);

    const response = await fetch(
      url,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Failed to fetch leads for tag ${tag} for staff:`, error);

    throw new Error(
      `Failed to fetch leads: ${error.message || "Unknown error"}`
    );
  }
}

// peding,today,tomorrow and interested api

export async function fetchStaffLeadsReport(tag: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/interested-leads/${tag}/`;

    console.log(`Fetching staff leads report for tag ${tag}:`, url);

    const response = await fetch(
      url,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Failed to fetch staff leads report for tag ${tag}:`, error);

    throw new Error(
      `Failed to fetch staff leads report: ${error.message || "Unknown error"}`
    );
  }
}
