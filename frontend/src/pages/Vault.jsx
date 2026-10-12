import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Icon = ({ name, size = 18, strokeWidth = 1.8 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (name) {
    case "vault":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h10M7 13h7M7 17h4" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <path d="M7 7h10l-3-3M17 7l-3 3" />
          <path d="M17 17H7l3 3M7 17l3-3" />
        </svg>
      );
    case "sent":
      return (
        <svg {...common}>
          <path d="M5 19L19 5" />
          <path d="M9 5h10v10" />
        </svg>
      );
    case "team":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3.5 19c.6-3.2 2.4-5 5.5-5s4.9 1.8 5.5 5" />
          <path d="M14 14.5c2.7.2 4.4 1.7 4.8 4.5" />
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.6-2.8 7.8-7 10-4.2-2.2-7-5.4-7-10V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "add":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
          <path d="M14 8l4 4-4 4M18 12H9" />
        </svg>
      );
    case "key":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="15.5" r="3.5" />
          <path d="M11 13l7-7M15 7l2 2M17 5l2 2" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="M4 20h4L19 9l-4-4L4 16v4z" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M15 15l4 4" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path d="M10 13.5l4-4" />
          <path d="M7.5 16.5l-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0" />
          <path d="M16.5 7.5l1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5z" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    default:
      return null;
  }
};
import "./Vault.css";

function Vault() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sharedCredentials, setSharedCredentials] = useState([]);
  const [sharedLoading, setSharedLoading] = useState(true);

  const [myShares, setMyShares] = useState([]);
  const [mySharesLoading, setMySharesLoading] = useState(true);

  const [showShareForm, setShowShareForm] = useState(false);
  const [shareCredentialId, setShareCredentialId] = useState("");
  const [sharedUserEmail, setSharedUserEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("VIEW_ONLY");
  const [shareExpiresAt, setShareExpiresAt] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  const [sharedEditingShare, setSharedEditingShare] = useState(null);
  const [sharedEditLoading, setSharedEditLoading] = useState(false);

  // =====================================================
  // TEAM VAULT
  // =====================================================

  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamCreateLoading, setTeamCreateLoading] = useState(false);

  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPermission, setMemberPermission] =
    useState("VIEW_ONLY");
  const [memberLoading, setMemberLoading] = useState(false);

  const [showAddTeamCredentialForm, setShowAddTeamCredentialForm] =
    useState(false);
  const [selectedCredentialToAdd, setSelectedCredentialToAdd] =
    useState("");
  const [teamCredentialLoading, setTeamCredentialLoading] =
    useState(false);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamCredentials, setTeamCredentials] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);

  // =====================================================
  // UI STATE
  // =====================================================

  const [activeSection, setActiveSection] = useState("vault");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [credentialTypeFilter, setCredentialTypeFilter] =
    useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);

  // =====================================================
  // CREDENTIAL FORM
  // =====================================================

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("General");
  const [credentialType, setCredentialType] = useState("LOGIN");
  const [tags, setTags] = useState("");

  // =====================================================
  // PASSWORD GENERATOR
  // =====================================================

  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    suggestions: [],
  });

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const selectedPools = [];

    if (includeUppercase) {
      selectedPools.push(uppercase);
    }

    if (includeLowercase) {
      selectedPools.push(lowercase);
    }

    if (includeNumbers) {
      selectedPools.push(numbers);
    }

    if (includeSpecial) {
      selectedPools.push(special);
    }

    if (selectedPools.length === 0) {
      alert("Please select at least one character type.");
      return;
    }

    let generatedCharacters = [];

    selectedPools.forEach((pool) => {
      const randomIndex =
        crypto.getRandomValues(
          new Uint32Array(1)
        )[0] % pool.length;

      generatedCharacters.push(
        pool[randomIndex]
      );
    });

    const allCharacters =
      selectedPools.join("");

    while (
      generatedCharacters.length <
      passwordLength
    ) {
      const randomIndex =
        crypto.getRandomValues(
          new Uint32Array(1)
        )[0] % allCharacters.length;

      generatedCharacters.push(
        allCharacters[randomIndex]
      );
    }

    for (
      let i = generatedCharacters.length - 1;
      i > 0;
      i--
    ) {
      const randomIndex =
        crypto.getRandomValues(
          new Uint32Array(1)
        )[0] % (i + 1);

      [
        generatedCharacters[i],
        generatedCharacters[randomIndex]
      ] = [
        generatedCharacters[randomIndex],
        generatedCharacters[i]
      ];
    }

    const generatedPassword =
      generatedCharacters.join("");

    setPassword(generatedPassword);

    setPasswordStrength(
      analyzePasswordStrength(
        generatedPassword
      )
    );
  };

  const analyzePasswordStrength = (value) => {
    if (!value) {
      return {
        score: 0,
        label: "",
        suggestions: [],
      };
    }

    let score = 0;
    const suggestions = [];

    if (value.length >= 8) score++;
    else suggestions.push("Use at least 8 characters.");

    if (value.length >= 12) score++;

    if (/[A-Z]/.test(value)) score++;
    else suggestions.push("Add uppercase letters.");

    if (/[a-z]/.test(value)) score++;
    else suggestions.push("Add lowercase letters.");

    if (/[0-9]/.test(value)) score++;
    else suggestions.push("Add numbers.");

    if (/[^A-Za-z0-9]/.test(value)) score++;
    else suggestions.push("Add special characters.");

    let label = "Weak";

    if (score >= 5) {
      label = "Strong";
    } else if (score >= 3) {
      label = "Medium";
    }

    return {
      score,
      label,
      suggestions,
    };
  };

  // =====================================================
  // FETCH CREDENTIALS
  // =====================================================

  const fetchCredentials = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/vault/credentials",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch credentials");
      }

      const data = await response.json();

      setCredentials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Credential fetch error:", error);
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH SHARED WITH ME
  // =====================================================

  const fetchSharedCredentials = async () => {
    try {
      setSharedLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/sharing/shared-with-me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shared credentials");
      }

      const data = await response.json();

      setSharedCredentials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Shared credential fetch error:",
        error
      );

      setSharedCredentials([]);
    } finally {
      setSharedLoading(false);
    }
  };

  // =====================================================
  // FETCH SHARED BY ME
  // =====================================================

  const fetchMyShares = async () => {
    try {
      setMySharesLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/sharing/my-shares",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shared credentials");
      }

      const data = await response.json();

      setMyShares(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("My shares fetch error:", error);
      setMyShares([]);
    } finally {
      setMySharesLoading(false);
    }
  };

  // =====================================================
  // FETCH CURRENT USER
  // =====================================================

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setCurrentUser(data);
    } catch (error) {
      console.error("Current user fetch error:", error);
    }
  };

  // =====================================================
  // FETCH TEAMS
  // =====================================================

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }

      const data = await response.json();

      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Teams fetch error:", error);
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  // =====================================================
  // FETCH TEAM MEMBERS
  // =====================================================

  const fetchTeamMembers = async (teamId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/teams/${teamId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }

      const data = await response.json();

      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Team members fetch error:",
        error
      );

      setTeamMembers([]);
    }
  };

  // =====================================================
  // FETCH TEAM CREDENTIALS
  // =====================================================

  const fetchTeamCredentials = async (teamId) => {
    try {
      setTeamLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/teams/${teamId}/credentials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch team credentials"
        );
      }

      const data = await response.json();

      setTeamCredentials(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Team credentials fetch error:",
        error
      );

      setTeamCredentials([]);
    } finally {
      setTeamLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCredentials();
    fetchSharedCredentials();
    fetchMyShares();
    fetchCurrentUser();
    fetchTeams();
  }, []);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goToSection = (section) => {
    setActiveSection(section);

    setShowForm(false);
    setShowShareForm(false);

    if (section === "shared") {
      fetchSharedCredentials();
    }

    if (section === "sharedByMe") {
      fetchMyShares();
    }

    if (section === "team") {
      fetchTeams();
    }
  };

  const goToSecurity = () => {
    navigate("/security");
  };

  // =====================================================
  // ADD CREDENTIAL
  // =====================================================

  const handleAddCredential = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    fetch(
      "http://localhost:8080/api/vault/credentials",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          username: username.trim(),
          password,
          url: url.trim(),
          notes: notes.trim(),
          category,
          credentialType,
          tags: tags.trim(),
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to add credential"
          );
        }

        return response.json();
      })
      .then(() => {
        alert(
          "Credential added successfully!"
        );

        clearForm();
        setShowForm(false);

        fetchCredentials();
      })
      .catch((error) => {
        console.error("Error:", error);

        alert(
          error.message ||
            "Failed to add credential."
        );
      });
  };

  // =====================================================
  // EDIT CREDENTIAL
  // =====================================================

  const handleEditCredential = (credential) => {
    setEditingCredential(credential);

    setTitle(credential.title || "");
    setUsername(credential.username || "");
    setPassword(credential.password || "");
    setUrl(credential.url || "");
    setNotes(credential.notes || "");
    setCategory(
      credential.category || "General"
    );
    setCredentialType(
      credential.credentialType || "LOGIN"
    );
    setTags(credential.tags || "");

    setPasswordStrength(
      analyzePasswordStrength(
        credential.password || ""
      )
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // UPDATE TEAM CREDENTIAL
  // =====================================================

  const handleUpdateTeamCredential = async (
    event
  ) => {
    event.preventDefault();

    if (!editingCredential) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/teams/${editingCredential.teamId}/credentials/${editingCredential.teamCredentialId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            username: username.trim(),
            password,
            url: url.trim(),
            notes: notes.trim(),
            category,
            credentialType,
            tags: tags.trim(),
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
            "Failed to update team credential."
        );
      }

      alert(
        "Team credential updated successfully!"
      );

      clearForm();
      setEditingCredential(null);
      setShowForm(false);

      await fetchTeamCredentials(
        editingCredential.teamId
      );
    } catch (error) {
      console.error(
        "Team credential update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update team credential."
      );
    }
  };

  // =====================================================
  // UPDATE CREDENTIAL
  // =====================================================

  const handleUpdateCredential = async (
    event
  ) => {
    event.preventDefault();

    if (!editingCredential) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/vault/credentials/${editingCredential.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            username: username.trim(),
            password,
            url: url.trim(),
            notes: notes.trim(),
            category,
            credentialType,
            tags: tags.trim(),
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
            "Failed to update credential."
        );
      }

      alert(
        "Credential updated successfully!"
      );

      clearForm();
      setEditingCredential(null);
      setShowForm(false);

      await fetchCredentials();
    } catch (error) {
      console.error(
        "Credential update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update credential."
      );
    }
  };

  // =====================================================
  // DELETE CREDENTIAL
  // =====================================================

  const handleDeleteCredential = (
    credentialId
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this credential?"
      );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:8080/api/vault/credentials/${credentialId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (response) => {
        const data =
          await response.text();

        if (!response.ok) {
          throw new Error(
            data ||
              "Failed to delete credential"
          );
        }

        return data;
      })
      .then(() => {
        alert(
          "Credential deleted successfully!"
        );

        fetchCredentials();
      })
      .catch((error) => {
        console.error("Error:", error);

        alert(
          error.message ||
            "Failed to delete credential."
        );
      });
  };

  // =====================================================
  // FAVORITE CREDENTIAL
  // =====================================================

  const handleToggleFavorite = async (
    credentialId
  ) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/vault/credentials/${credentialId}/favorite`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update favorite."
        );
      }

      await fetchCredentials();
    } catch (error) {
      console.error(
        "Favorite update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update favorite."
      );
    }
  };

  // =====================================================
  // SHARE CREDENTIAL
  // =====================================================

  const handleShareCredential = async (
    event
  ) => {
    event.preventDefault();

    if (!shareCredentialId) {
      alert(
        "Please select a credential."
      );
      return;
    }

    if (!sharedUserEmail.trim()) {
      alert(
        "Please enter the user's email."
      );
      return;
    }

    const token = localStorage.getItem("token");

    setShareLoading(true);

    try {
      const params =
        new URLSearchParams();

      params.append(
        "credentialId",
        shareCredentialId
      );

      params.append(
        "sharedUserEmail",
        sharedUserEmail.trim()
      );

      params.append(
        "permissionLevel",
        sharePermission
      );

      if (shareExpiresAt) {
        params.append(
          "expiresAt",
          shareExpiresAt
        );
      }

      const response = await fetch(
        `http://localhost:8080/api/sharing/share?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
            "Failed to share credential."
        );
      }

      alert(
        "Credential shared successfully!"
      );

      setShowShareForm(false);
      setShareCredentialId("");
      setSharedUserEmail("");
      setSharePermission("VIEW_ONLY");
      setShareExpiresAt("");

      await fetchMyShares();
    } catch (error) {
      console.error(
        "Share credential error:",
        error
      );

      alert(
        error.message ||
          "Failed to share credential."
      );
    } finally {
      setShareLoading(false);
    }
  };

  // =====================================================
  // REMOVE SHARING
  // =====================================================

  const handleRemoveSharing = async (
    shareId
  ) => {
    const confirmRemove =
      window.confirm(
        "Are you sure you want to remove this sharing?"
      );

    if (!confirmRemove) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/sharing/share/${shareId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
            "Failed to remove sharing."
        );
      }

      alert(
        "Sharing removed successfully!"
      );

      await fetchMyShares();
    } catch (error) {
      console.error(
        "Remove sharing error:",
        error
      );

      alert(
        error.message ||
          "Failed to remove sharing."
      );
    }
  };

  // =====================================================
  // UPDATE SHARED PERMISSION
  // =====================================================

  const handleUpdateSharedPermission =
    async (share) => {
      if (!share) {
        return;
      }

      const permission =
        window.prompt(
          "Enter permission: VIEW_ONLY, EDIT, or FULL_MANAGEMENT",
          share.permissionLevel ||
            "VIEW_ONLY"
        );

      if (!permission) {
        return;
      }

      const normalized =
        permission.trim().toUpperCase();

      if (
        ![
          "VIEW_ONLY",
          "EDIT",
          "FULL_MANAGEMENT",
        ].includes(normalized)
      ) {
        alert(
          "Invalid permission level."
        );
        return;
      }

      const token = localStorage.getItem("token");

      setSharedEditLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/sharing/share/${share.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              permissionLevel:
                normalized,
            }),
          }
        );

        const data =
          await response.text();

        if (!response.ok) {
          throw new Error(
            data ||
              "Failed to update sharing."
          );
        }

        alert(
          "Sharing permission updated successfully!"
        );

        setSharedEditingShare(null);

        await fetchMyShares();
      } catch (error) {
        console.error(
          "Shared permission update error:",
          error
        );

        alert(
          error.message ||
            "Failed to update sharing."
        );
      } finally {
        setSharedEditLoading(false);
      }
    };

  // =====================================================
  // CREATE TEAM
  // =====================================================

  const handleCreateTeam = async (
    event
  ) => {
    event.preventDefault();

    if (!teamName.trim()) {
      alert(
        "Please enter a team name."
      );
      return;
    }

    const token = localStorage.getItem("token");

    setTeamCreateLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/teams?name=${encodeURIComponent(
          teamName.trim()
        )}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
            "Failed to create team."
        );
      }

      alert(
        "Team created successfully!"
      );

      setTeamName("");
      setShowCreateTeamForm(false);

      await fetchTeams();
    } catch (error) {
      console.error(
        "Create team error:",
        error
      );

      alert(
        error.message ||
          "Failed to create team."
      );
    } finally {
      setTeamCreateLoading(false);
    }
  };

  // =====================================================
  // OPEN TEAM
  // =====================================================

  const handleOpenTeam = async (
    team
  ) => {
    setSelectedTeam(team);
    setActiveSection("team");

    await fetchTeamMembers(team.id);
    await fetchTeamCredentials(
      team.id
    );
  };

  // =====================================================
  // ADD TEAM MEMBER
  // =====================================================

  const handleAddTeamMember = async (
    event
  ) => {
    event.preventDefault();

    if (!selectedTeam) {
      return;
    }

    if (!memberEmail.trim()) {
      alert(
        "Please enter the member email."
      );
      return;
    }

    const token = localStorage.getItem("token");

    setMemberLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/teams/${selectedTeam.id}/members?email=${encodeURIComponent(
          memberEmail.trim()
        )}&permissionLevel=${encodeURIComponent(
          memberPermission
        )}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.text();

      if (!response.ok) {
        throw new Error(
          data ||
            "Failed to add team member."
        );
      }

      alert(
        "Team member added successfully!"
      );

      setMemberEmail("");
      setMemberPermission("VIEW_ONLY");
      setShowAddMemberForm(false);

      await fetchTeamMembers(
        selectedTeam.id
      );
    } catch (error) {
      console.error(
        "Add team member error:",
        error
      );

      alert(
        error.message ||
          "Failed to add team member."
      );
    } finally {
      setMemberLoading(false);
    }
  };

  // =====================================================
  // ADD CREDENTIAL TO TEAM
  // =====================================================

  const handleAddCredentialToTeam =
    async (event) => {
      event.preventDefault();

      if (
        !selectedTeam ||
        !selectedCredentialToAdd
      ) {
        alert(
          "Please select a credential."
        );
        return;
      }

      setTeamCredentialLoading(true);

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `http://localhost:8080/api/teams/${selectedTeam.id}/credentials/${selectedCredentialToAdd}`,
            {
              method: "POST",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.text();

        if (!response.ok) {
          throw new Error(
            data ||
              "Failed to add credential to team."
          );
        }

        alert(
          "Credential added to team successfully!"
        );

        setSelectedCredentialToAdd(
          ""
        );

        setShowAddTeamCredentialForm(
          false
        );

        await fetchTeamCredentials(
          selectedTeam.id
        );
      } catch (error) {
        console.error(
          "Add team credential error:",
          error
        );

        alert(
          error.message ||
            "Failed to add credential to team."
        );
      } finally {
        setTeamCredentialLoading(
          false
        );
      }
    };

  // =====================================================
  // UPDATE TEAM CREDENTIAL
  // =====================================================

  // =====================================================
  // DELETE TEAM CREDENTIAL
  // =====================================================

  const handleDeleteTeamCredential =
    async (teamCredentialId) => {
      if (!selectedTeam) {
        return;
      }

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this team credential?"
        );

      if (!confirmDelete) {
        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      try {
        const response =
          await fetch(
            `http://localhost:8080/api/teams/${selectedTeam.id}/credentials/${teamCredentialId}/delete`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.text();

        if (!response.ok) {
          throw new Error(
            data ||
              "Failed to delete team credential."
          );
        }

        alert(
          "Team credential deleted successfully!"
        );

        await fetchTeamCredentials(
          selectedTeam.id
        );
      } catch (error) {
        console.error(
          "Delete team credential error:",
          error
        );

        alert(
          error.message ||
            "Failed to delete team credential."
        );
      }
    };

  // =====================================================
  // CLEAR FORM
  // =====================================================

  const clearForm = () => {
    setTitle("");
    setUsername("");
    setPassword("");
    setUrl("");
    setNotes("");
    setCategory("General");
    setCredentialType("LOGIN");
    setTags("");

    setPasswordStrength({
      score: 0,
      label: "",
      suggestions: [],
    });
  };

  // =====================================================
  // CANCEL FORM
  // =====================================================

  const handleCancel = () => {
    clearForm();
    setEditingCredential(null);
    setShowForm(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // =====================================================
  // CURRENT USER / TEAM PERMISSIONS
  // =====================================================

  const currentUserEmail =
    typeof currentUser === "string"
      ? currentUser
      : currentUser?.email;

  const currentUserId =
    typeof currentUser === "object"
      ? currentUser?.id
      : null;

  const isTeamOwner =
    Boolean(
      selectedTeam?.owner &&
        (
          (currentUserId &&
            currentUserId ===
              selectedTeam.owner.id) ||
          (currentUserEmail &&
            currentUserEmail ===
              selectedTeam.owner.email)
        )
    );

  const currentMembership =
    teamMembers.find((member) => {
      const memberEmail =
        member.email ||
        member.user?.email;

      const memberId =
        member.userId ||
        member.user?.id ||
        member.id;

      const sameEmail =
        currentUserEmail &&
        memberEmail &&
        memberEmail.toLowerCase() ===
          currentUserEmail.toLowerCase();

      const sameId =
        currentUserId &&
        memberId &&
        String(memberId) ===
          String(currentUserId);

      return (sameEmail || sameId) &&
        member.active !== false;
    });

  const currentPermission =
    String(
      currentMembership?.permissionLevel ||
      currentMembership?.permission ||
      "VIEW_ONLY"
    ).toUpperCase();

  // The backend intentionally does not create a TeamMember row
  // for the team owner. Therefore, when a user can access a team
  // but has no active membership, that user is the owner.
  const userOwnsSelectedTeam =
    Boolean(selectedTeam) &&
    (isTeamOwner || !currentMembership);

  const canManageTeam =
    userOwnsSelectedTeam ||
    currentPermission ===
      "FULL_MANAGEMENT";

  const canEditTeamCredential =
    userOwnsSelectedTeam ||
    currentPermission ===
      "FULL_MANAGEMENT" ||
    currentPermission === "EDIT";

  const canDeleteTeamCredential =
    userOwnsSelectedTeam ||
    currentPermission ===
      "FULL_MANAGEMENT";

  // =====================================================
  // FILTER CREDENTIALS
  // =====================================================

  const filteredCredentials =
    credentials.filter(
      (credential) =>
        (!favoritesOnly ||
          credential.favorite === true) &&
        (categoryFilter === "ALL" ||
          (credential.category ||
            "General") ===
            categoryFilter) &&
        (credentialTypeFilter ===
          "ALL" ||
          (credential.credentialType ||
            "LOGIN") ===
            credentialTypeFilter) &&
        `${credential.title} ${
          credential.username
        } ${credential.url || ""} ${
          credential.tags || ""
        }`
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="vault-page">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="vault-sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <Icon name="lock" />
          </div>

          <div>
            <h1>SecureVault</h1>

            <p>
              Your passwords. Secured.
            </p>
          </div>

        </div>

        <div className="sidebar-menu">

          <button
            className={`sidebar-button ${
              activeSection === "vault"
                ? "active"
                : ""
            }`}
            onClick={() =>
              goToSection("vault")
            }
          >
            <span className="sidebar-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="2"
                />
                <path d="M7 8h10" />
                <path d="M7 12h6" />
                <path d="M7 16h4" />
              </svg>
            </span>

            My Vault
          </button>

          <button
            className={`sidebar-button ${
              activeSection === "shared"
                ? "active"
                : ""
            }`}
            onClick={() =>
              goToSection("shared")
            }
          >
            <span className="sidebar-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M7 7h10l-3-3" />
                <path d="M17 7l-3 3" />
                <path d="M17 17H7l3 3" />
                <path d="M7 17l3-3" />
              </svg>
            </span>

            Shared With Me
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "sharedByMe"
                ? "active"
                : ""
            }`}
            onClick={() =>
              goToSection(
                "sharedByMe"
              )
            }
          >
            <span className="sidebar-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M5 19L19 5" />
                <path d="M9 5h10v10" />
              </svg>
            </span>

            Shared By Me
          </button>

          <button
            className={`sidebar-button ${
              activeSection === "team"
                ? "active"
                : ""
            }`}
            onClick={() =>
              goToSection("team")
            }
          >
            <span className="sidebar-icon">
              <Icon name="team" />
            </span>

            Team Vault
          </button>

          <button
            className="sidebar-button"
            onClick={goToSecurity}
          >
            <span className="sidebar-icon">
              <Icon name="security" />
            </span>

            Security Center
          </button>

          <button
            className="sidebar-button"
            onClick={() => {
              goToSection("vault");
              setShowForm(true);
            }}
          >
            <span className="sidebar-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </span>

            Add Credential
          </button>

          <button
            className="sidebar-button"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
                <path d="M14 8l4 4-4 4" />
                <path d="M18 12H9" />
              </svg>
            </span>

            Logout
          </button>

        </div>

        <div className="sidebar-security">

          <div className="security-icon">
            <Icon name="security" />
          </div>

          <h3>Vault Secure</h3>

          <p>
            Your data is encrypted
            <br />
            and protected
          </p>

          <div className="security-status">
            <span>
              Secure Connection
            </span>

            <span className="security-dot"></span>
          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN
          ================================================= */}

      <main className="vault-main">

        <header className="vault-topbar">

          <div className="vault-status">

            <span className="status-dot"></span>

            Vault Secure

          </div>

        </header>

        <div className="vault-container">

          {/* =================================================
              HERO
              ================================================= */}

          <section className="vault-title-section">

            <div>

              <h2>
                {activeSection ===
                  "vault" &&
                  "My Vault"}

                {activeSection ===
                  "shared" &&
                  "Shared With Me"}

                {activeSection ===
                  "sharedByMe" &&
                  "Shared By Me"}

                {activeSection ===
                  "team" &&
                  (
                    selectedTeam
                      ? selectedTeam.name
                      : "Team Vault"
                  )}
              </h2>

              <p>
                {activeSection ===
                  "vault" &&
                  "Securely manage your saved credentials."}

                {activeSection ===
                  "shared" &&
                  "Credentials shared with you by other users."}

                {activeSection ===
                  "sharedByMe" &&
                  "Manage credentials you have shared."}

                {activeSection ===
                  "team" &&
                  (
                    selectedTeam
                      ? "Team members and credentials available in this team."
                      : "Collaborate securely with your team."
                  )}
              </p>

            </div>

            {activeSection ===
              "vault" && (

              <button
                type="button"
                className="add-button"
                onClick={() => {
                  goToSection("vault");
                  setShowForm(true);
                }}
              >
                + Add Credential
              </button>

            )}

            {activeSection ===
              "team" &&
              !selectedTeam && (

              <button
                type="button"
                className="add-button"
                onClick={() =>
                  setShowCreateTeamForm(
                    !showCreateTeamForm
                  )
                }
              >
                + Create Team
              </button>

            )}

          </section>

          {/* =================================================
              CREATE TEAM FORM
              ================================================= */}

          {activeSection ===
            "team" &&
            !selectedTeam &&
            showCreateTeamForm && (

            <div className="credential-form-card">

              <div className="form-heading">

                <h3>
                  Create Team
                </h3>

                <p>
                  Create a secure team
                  workspace.
                </p>

              </div>

              <form
                onSubmit={
                  handleCreateTeam
                }
              >

                <div className="form-grid">

                  <div className="vault-field full-width">

                    <label>
                      Team Name
                    </label>

                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) =>
                        setTeamName(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Development Team"
                      required
                    />

                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setTeamName("");
                      setShowCreateTeamForm(
                        false
                      );
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-button"
                    disabled={
                      teamCreateLoading
                    }
                  >
                    {teamCreateLoading
                      ? "Creating..."
                      : "Create Team"}
                  </button>

                </div>

              </form>

            </div>

          )}

          {/* =================================================
              ADD / EDIT FORM
              ================================================= */}

          {showForm &&
            activeSection ===
              "vault" && (

            <div className="credential-form-card">

              <div className="form-heading">

                <h3>
                  {editingCredential
                    ? "Edit Credential"
                    : "Add New Credential"}
                </h3>

                <p>
                  {editingCredential
                    ? "Update your saved login details."
                    : "Store your login details securely."}
                </p>

              </div>

              <form
                onSubmit={
                  editingCredential?.teamCredentialId
                    ? handleUpdateTeamCredential
                    : editingCredential
                    ? handleUpdateCredential
                    : handleAddCredential
                }
              >

                <div className="form-grid">

                  {/* TITLE */}

                  <div className="vault-field">

                    <label>
                      Title
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(e) =>
                        setTitle(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Google"
                      required
                    />

                  </div>

                  {/* USERNAME */}

                  <div className="vault-field">

                    <label>
                      Username / Email
                    </label>

                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      placeholder="Enter username or email"
                      required
                    />

                  </div>

                  {/* PASSWORD */}

                  <div className="vault-field password-main-field">

                    <label>
                      Password
                    </label>

                    <input
                      type="text"
                      value={password}
                      onChange={(e) => {
                        const value =
                          e.target.value;

                        setPassword(
                          value
                        );

                        setPasswordStrength(
                          analyzePasswordStrength(
                            value
                          )
                        );
                      }}
                      placeholder="Enter password"
                      required
                    />

                    <div className="password-generator-options">

                      <div className="password-length-row">

                        <span>
                          Password Length
                        </span>

                        <span>
                          {passwordLength}
                        </span>

                      </div>

                      <input
                        className="password-length-slider"
                        type="range"
                        min="8"
                        max="32"
                        value={
                          passwordLength
                        }
                        onChange={(e) =>
                          setPasswordLength(
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />

                      <div className="character-types-row">

                        <span className="generator-label">
                          Character Types
                        </span>

                        <div className="character-options">

                          <label className="character-option">

                            <input
                              type="checkbox"
                              checked={
                                includeUppercase
                              }
                              onChange={(e) =>
                                setIncludeUppercase(
                                  e.target.checked
                                )
                              }
                            />

                            <span>
                              Uppercase
                            </span>

                          </label>

                          <label className="character-option">

                            <input
                              type="checkbox"
                              checked={
                                includeLowercase
                              }
                              onChange={(e) =>
                                setIncludeLowercase(
                                  e.target.checked
                                )
                              }
                            />

                            <span>
                              Lowercase
                            </span>

                          </label>

                          <label className="character-option">

                            <input
                              type="checkbox"
                              checked={
                                includeNumbers
                              }
                              onChange={(e) =>
                                setIncludeNumbers(
                                  e.target.checked
                                )
                              }
                            />

                            <span>
                              Numbers
                            </span>

                          </label>

                          <label className="character-option">

                            <input
                              type="checkbox"
                              checked={
                                includeSpecial
                              }
                              onChange={(e) =>
                                setIncludeSpecial(
                                  e.target.checked
                                )
                              }
                            />

                            <span>
                              Special
                            </span>

                          </label>

                        </div>

                      </div>

                      <button
                        type="button"
                        className="generate-password-button"
                        onClick={
                          generatePassword
                        }
                      >
                        Generate Password
                      </button>

                      {password && (

                        <div className="password-strength-compact">

                          <div>

                            <strong>
                              Password Strength:{" "}
                              {
                                passwordStrength.label
                              }
                            </strong>

                            <span>
                              Score:{" "}
                              {
                                passwordStrength.score
                              }
                              /6
                            </span>

                          </div>

                          {passwordStrength
                            .suggestions
                            .length >
                            0 && (

                            <p>
                              {
                                passwordStrength
                                  .suggestions
                                  .join(" ")
                              }
                            </p>

                          )}

                        </div>

                      )}

                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div className="vault-field">

                    <label>
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(
                          e.target.value
                        )
                      }
                    >

                      <option value="General">
                        General
                      </option>

                      <option value="Personal">
                        Personal
                      </option>

                      <option value="Work">
                        Work
                      </option>

                      <option value="Finance">
                        Finance
                      </option>

                      <option value="Social">
                        Social
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* CREDENTIAL TYPE */}

                  <div className="vault-field">

                    <label>
                      Credential Type
                    </label>

                    <select
                      value={
                        credentialType
                      }
                      onChange={(e) =>
                        setCredentialType(
                          e.target.value
                        )
                      }
                    >

                      <option value="LOGIN">
                        Login
                      </option>

                      <option value="API_KEY">
                        API Key
                      </option>

                      <option value="CREDIT_CARD">
                        Credit Card
                      </option>

                      <option value="SECURE_NOTE">
                        Secure Note
                      </option>

                      <option value="OTHER">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* WEBSITE */}

                  <div className="vault-field">

                    <label>
                      Website URL
                    </label>

                    <input
                      type="text"
                      value={url}
                      onChange={(e) =>
                        setUrl(
                          e.target.value
                        )
                      }
                      placeholder="https://example.com"
                    />

                  </div>

                  {/* NOTES */}

                  <div className="vault-field full-width">

                    <label>
                      Notes
                    </label>

                    <textarea
                      rows="3"
                      value={notes}
                      onChange={(e) =>
                        setNotes(
                          e.target.value
                        )
                      }
                      placeholder="Add any additional notes"
                    />

                  </div>

                  {/* TAGS */}

                  <div className="vault-field full-width">

                    <label>
                      Tags
                    </label>

                    <input
                      type="text"
                      value={tags}
                      onChange={(e) =>
                        setTags(
                          e.target.value
                        )
                      }
                      placeholder="e.g. important, work, banking"
                    />

                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={
                      handleCancel
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-button"
                  >
                    {editingCredential
                      ? "Update Credential"
                      : "Save Credential"}
                  </button>

                </div>

              </form>

            </div>

          )}

          {/* =================================================
              SHARE FORM
              ================================================= */}

          {showShareForm &&
            activeSection ===
              "vault" && (

            <div className="credential-form-card">

              <div className="form-heading">

                <h3>
                  Share Credential
                </h3>

                <p>
                  Share one of your saved
                  credentials with another
                  SecureVault user.
                </p>

              </div>

              <form
                onSubmit={
                  handleShareCredential
                }
              >

                <div className="form-grid">

                  <div className="vault-field">

                    <label>
                      Select Credential
                    </label>

                    <select
                      value={
                        shareCredentialId
                      }
                      onChange={(e) =>
                        setShareCredentialId(
                          e.target.value
                        )
                      }
                      required
                    >

                      <option value="">
                        Select a credential
                      </option>

                      {credentials.map(
                        (credential) => (

                          <option
                            key={
                              credential.id
                            }
                            value={
                              credential.id
                            }
                          >
                            {
                              credential.title
                            }
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  <div className="vault-field">

                    <label>
                      Shared User Email
                    </label>

                    <input
                      type="email"
                      value={
                        sharedUserEmail
                      }
                      onChange={(e) =>
                        setSharedUserEmail(
                          e.target.value
                        )
                      }
                      placeholder="Enter user's email"
                      required
                    />

                  </div>

                  <div className="vault-field">

                    <label>
                      Permission Level
                    </label>

                    <select
                      value={
                        sharePermission
                      }
                      onChange={(e) =>
                        setSharePermission(
                          e.target.value
                        )
                      }
                    >

                      <option value="VIEW_ONLY">
                        View Only
                      </option>

                      <option value="EDIT">
                        Edit
                      </option>

                      <option value="FULL_MANAGEMENT">
                        Full Management
                      </option>

                    </select>

                  </div>

                  <div className="vault-field">

                    <label>
                      Expires At
                    </label>

                    <input
                      type="datetime-local"
                      value={
                        shareExpiresAt
                      }
                      onChange={(e) =>
                        setShareExpiresAt(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      setShowShareForm(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-button"
                    disabled={
                      shareLoading
                    }
                  >
                    {shareLoading
                      ? "Sharing..."
                      : "Share Credential"}
                  </button>

                </div>

              </form>

            </div>

          )}
                    {/* =================================================
              MAIN CONTENT
              ================================================= */}

          {activeSection === "vault" && (
            <>
              {!showForm && !showShareForm && (
                <>

                  <div className="vault-toolbar">

                    <div className="search-box">
                      <span className="search-icon">
                        <Icon name="search" size={16} />
                      </span>

                      <input
                        type="text"
                        placeholder="Search credentials..."
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <select
                      value={categoryFilter}
                      onChange={(e) =>
                        setCategoryFilter(
                          e.target.value
                        )
                      }
                    >
                      <option value="ALL">
                        All Categories
                      </option>
                      <option value="General">
                        General
                      </option>
                      <option value="Personal">
                        Personal
                      </option>
                      <option value="Work">
                        Work
                      </option>
                      <option value="Finance">
                        Finance
                      </option>
                      <option value="Social">
                        Social
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>

                    <select
                      value={credentialTypeFilter}
                      onChange={(e) =>
                        setCredentialTypeFilter(
                          e.target.value
                        )
                      }
                    >
                      <option value="ALL">
                        All Types
                      </option>
                      <option value="LOGIN">
                        Login
                      </option>
                      <option value="API_KEY">
                        API Key
                      </option>
                      <option value="CREDIT_CARD">
                        Credit Card
                      </option>
                      <option value="SECURE_NOTE">
                        Secure Note
                      </option>
                      <option value="OTHER">
                        Other
                      </option>
                    </select>

                    <button
                      type="button"
                      className={`filter-button ${
                        favoritesOnly
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setFavoritesOnly(
                          !favoritesOnly
                        )
                      }
                    >
                      ★ Favorites
                    </button>

                    <button
                      type="button"
                      className="share-button"
                      onClick={() => {
                        setShowShareForm(true);
                        setShowForm(false);
                      }}
                    >
                      Share Credential
                    </button>

                  </div>

                  {loading ? (

                    <div className="loading-state">
                      <p>
                        Loading credentials...
                      </p>
                    </div>

                  ) : filteredCredentials.length === 0 ? (

                    <div className="empty-state">

                      <div className="empty-icon">
                        <Icon name="lock" />
                      </div>

                      <h3>
                        {favoritesOnly
                          ? "No favorite credentials"
                          : "Your vault is empty"}
                      </h3>

                      <p>
                        {favoritesOnly
                          ? "You have not marked any credential as favorite."
                          : "Add your first credential to get started."}
                      </p>

                      {!favoritesOnly && (
                        <button
                          className="empty-add-button"
                          onClick={() => {
                            setEditingCredential(
                              null
                            );
                            clearForm();
                            setShowForm(true);
                          }}
                        >
                          + Add Your First Credential
                        </button>
                      )}

                    </div>

                  ) : (

                    <div className="credentials-grid">

                      {filteredCredentials.map(
                        (credential) => (

                          <div
                            className="credential-card"
                            key={credential.id}
                          >

                            <div className="credential-card-header">

                              <div className="credential-title-area">

                                <div className="credential-icon">
                                  <Icon name="key" />
                                </div>

                                <div>

                                  <h3>
                                    {
                                      credential.title
                                    }
                                  </h3>

                                  <span className="credential-category">
                                    {
                                      credential.category ||
                                      "General"
                                    }
                                  </span>

                                </div>

                              </div>

                              <button
                                type="button"
                                className={`favorite-button ${
                                  credential.favorite
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleToggleFavorite(
                                    credential.id
                                  )
                                }
                                title="Favorite"
                              >
                                {credential.favorite
                                  ? "★"
                                  : "☆"}
                              </button>

                            </div>

                            <div className="credential-details">

                              <div className="credential-detail-row">

                                <span>
                                  Username
                                </span>

                                <strong>
                                  {
                                    credential.username
                                  }
                                </strong>

                              </div>

                              <div className="credential-detail-row">

                                <span>
                                  Password
                                </span>

                                <strong>
                                  ••••••••••••
                                </strong>

                              </div>

                              {credential.url && (

                                <div className="credential-detail-row">

                                  <span>
                                    Website
                                  </span>

                                  <a
                                    href={
                                      credential.url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {
                                      credential.url
                                    }
                                  </a>

                                </div>

                              )}

                              {credential.tags && (

                                <div className="credential-tags">

                                  {credential.tags
                                    .split(",")
                                    .map(
                                      (tag) => (
                                        <span
                                          key={
                                            tag.trim()
                                          }
                                        >
                                          {
                                            tag.trim()
                                          }
                                        </span>
                                      )
                                    )}

                                </div>

                              )}

                            </div>

                            <div className="credential-actions">

                              <button
                                type="button"
                                className="edit-button"
                                onClick={() =>
                                  handleEditCredential(
                                    credential
                                  )
                                }
                              >
                                <><Icon name="edit" size={14} /> Edit</>
                              </button>

                              <button
                                type="button"
                                className="share-card-button"
                                onClick={() => {
                                  setShareCredentialId(
                                    credential.id
                                  );
                                  setShowShareForm(
                                    true
                                  );
                                  setShowForm(false);
                                }}
                              >
                                <><Icon name="link" size={14} /> Share</>
                              </button>

                              <button
                                type="button"
                                className="delete-button"
                                onClick={() =>
                                  handleDeleteCredential(
                                    credential.id
                                  )
                                }
                              >
                                <><Icon name="trash" size={14} /> Delete</>
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </>
              )}
            </>
          )}

          {/* =================================================
              SHARED WITH ME
              ================================================= */}

          {activeSection === "shared" && (

            <section className="content-section">

              <div className="section-header-row">

                <div>
                  <h3>
                    Shared With Me
                  </h3>

                  <p>
                    Credentials shared with
                    your account.
                  </p>
                </div>

              </div>

              {sharedLoading ? (

                <div className="loading-state">
                  <p>
                    Loading shared credentials...
                  </p>
                </div>

              ) : sharedCredentials.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    <Icon name="link" />
                  </div>

                  <h3>
                    No shared credentials
                  </h3>

                  <p>
                    No credentials have been
                    shared with you yet.
                  </p>

                </div>

              ) : (

                <div className="credentials-grid">

                  {sharedCredentials.map(
                    (share) => (

                      <div
                        className="credential-card shared-card"
                        key={
                          share.id ||
                          share.shareId
                        }
                      >

                        <div className="credential-card-header">

                          <div className="credential-title-area">

                            <div className="credential-icon">
                              <Icon name="link" />
                            </div>

                            <div>

                              <h3>
                                {
                                  share.credential?.title ||
                                  share.title ||
                                  "Shared Credential"
                                }
                              </h3>

                              <span className="credential-category">
                                Shared
                              </span>

                            </div>

                          </div>

                        </div>

                        <div className="credential-details">

                          <div className="credential-detail-row">

                            <span>
                              Shared By
                            </span>

                            <strong>
                              {
                                share.owner?.email ||
                                share.sharedBy?.email ||
                                share.ownerEmail ||
                                "User"
                              }
                            </strong>

                          </div>

                          <div className="credential-detail-row">

                            <span>
                              Permission
                            </span>

                            <strong>
                              {
                                share.permissionLevel ||
                                "VIEW_ONLY"
                              }
                            </strong>

                          </div>

                          <div className="credential-detail-row">

                            <span>
                              Username
                            </span>

                            <strong>
                              {
                                share.credential?.username ||
                                share.username ||
                                "Hidden"
                              }
                            </strong>

                          </div>

                        </div>

                        <div className="credential-actions">

                          <button
                            type="button"
                            className="view-button"
                            onClick={async () => {

                              const token =
                                localStorage.getItem(
                                  "token"
                                );

                              try {

                                const response =
                                  await fetch(
                                    `http://localhost:8080/api/sharing/shared/${share.id}`,
                                    {
                                      method:
                                        "GET",
                                      headers: {
                                        Authorization:
                                          `Bearer ${token}`,
                                      },
                                    }
                                  );

                                const data =
                                  await response.text();

                                if (!response.ok) {
                                  throw new Error(
                                    data ||
                                      "Failed to view shared credential."
                                  );
                                }

                                alert(
                                  data ||
                                    "Shared credential accessed successfully."
                                );

                              } catch (error) {

                                alert(
                                  error.message ||
                                    "Failed to view shared credential."
                                );

                              }

                            }}
                          >
                            View
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          )}

          {/* =================================================
              SHARED BY ME
              ================================================= */}

          {activeSection === "sharedByMe" && (

            <section className="content-section">

              <div className="section-header-row">

                <div>
                  <h3>
                    Shared By Me
                  </h3>

                  <p>
                    Manage credentials that you
                    have shared.
                  </p>
                </div>

              </div>

              {mySharesLoading ? (

                <div className="loading-state">
                  <p>
                    Loading shared credentials...
                  </p>
                </div>

              ) : myShares.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    <Icon name="link" />
                  </div>

                  <h3>
                    Nothing shared yet
                  </h3>

                  <p>
                    Credentials you share will
                    appear here.
                  </p>

                </div>

              ) : (

                <div className="credentials-grid">

                  {myShares.map(
                    (share) => (

                      <div
                        className="credential-card"
                        key={share.id}
                      >

                        <div className="credential-card-header">

                          <div className="credential-title-area">

                            <div className="credential-icon">
                              <Icon name="link" />
                            </div>

                            <div>

                              <h3>
                                {
                                  share.credential?.title ||
                                  share.title ||
                                  "Credential"
                                }
                              </h3>

                              <span className="credential-category">
                                Shared
                              </span>

                            </div>

                          </div>

                        </div>

                        <div className="credential-details">

                          <div className="credential-detail-row">

                            <span>
                              Shared With
                            </span>

                            <strong>
                              {
                                share.sharedUser?.email ||
                                share.sharedWith?.email ||
                                share.sharedUserEmail ||
                                "User"
                              }
                            </strong>

                          </div>

                          <div className="credential-detail-row">

                            <span>
                              Permission
                            </span>

                            <strong>
                              {
                                share.permissionLevel ||
                                "VIEW_ONLY"
                              }
                            </strong>

                          </div>

                          {share.expiresAt && (

                            <div className="credential-detail-row">

                              <span>
                                Expires
                              </span>

                              <strong>
                                {
                                  share.expiresAt
                                }
                              </strong>

                            </div>

                          )}

                        </div>

                        <div className="credential-actions">

                          <button
                            type="button"
                            className="edit-button"
                            disabled={
                              sharedEditLoading
                            }
                            onClick={() =>
                              handleUpdateSharedPermission(
                                share
                              )
                            }
                          >
                            <><Icon name="edit" size={14} /> Permission</>
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleRemoveSharing(
                                share.id
                              )
                            }
                          >
                            <><Icon name="trash" size={14} /> Remove</>
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          )}

          {/* =================================================
              TEAM VAULT
              ================================================= */}

          {activeSection === "team" && (

            <section className="content-section">

              {!selectedTeam ? (

                <>

                  {teamsLoading ? (

                    <div className="loading-state">
                      <p>
                        Loading teams...
                      </p>
                    </div>

                  ) : teams.length === 0 ? (

                    <div className="empty-state">

                      <div className="empty-icon">
                        <Icon name="team" />
                      </div>

                      <h3>
                        No teams yet
                      </h3>

                      <p>
                        Create a team to securely
                        collaborate.
                      </p>

                      <button
                        className="empty-add-button"
                        onClick={() =>
                          setShowCreateTeamForm(
                            true
                          )
                        }
                      >
                        + Create Team
                      </button>

                    </div>

                  ) : (

                    <div className="team-grid">

                      {teams.map(
                        (team) => (

                          <div
                            className="team-card"
                            key={team.id}
                          >

                            <div className="team-card-icon">
                              <Icon name="team" />
                            </div>

                            <div className="team-card-content">

                              <h3>
                                {team.name}
                              </h3>

                              <p>
                                Secure team
                                workspace
                              </p>

                            </div>

                            <button
                              type="button"
                              className="view-button"
                              onClick={() =>
                                handleOpenTeam(
                                  team
                                )
                              }
                            >
                              Open Team
                            </button>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </>

              ) : (

                <>

                  <div className="team-toolbar">

                    <button
                      type="button"
                      className="back-button"
                      onClick={() => {
                        setSelectedTeam(null);
                        setTeamMembers([]);
                        setTeamCredentials([]);
                        fetchTeams();
                      }}
                    >
                      ← Back to Teams
                    </button>

                    <div className="team-actions">

                      {canManageTeam && (

                        <button
                          type="button"
                          className="add-button"
                          onClick={() =>
                            setShowAddMemberForm(
                              !showAddMemberForm
                            )
                          }
                        >
                          + Add Member
                        </button>

                      )}

                      {canManageTeam && (

                        <button
                          type="button"
                          className="add-button"
                          onClick={() =>
                            setShowAddTeamCredentialForm(
                              !showAddTeamCredentialForm
                            )
                          }
                        >
                          + Add Credential
                        </button>

                      )}

                    </div>

                  </div>

                  {/* TEAM MEMBER FORM */}

                  {showAddMemberForm && (
                    <div className="credential-form-card">

                      <div className="form-heading">

                        <h3>
                          Add Team Member
                        </h3>

                        <p>
                          Give another SecureVault
                          user access to this team.
                        </p>

                      </div>

                      <form
                        onSubmit={
                          handleAddTeamMember
                        }
                      >

                        <div className="form-grid">

                          <div className="vault-field">

                            <label>
                              User Email
                            </label>

                            <input
                              type="email"
                              value={
                                memberEmail
                              }
                              onChange={(e) =>
                                setMemberEmail(
                                  e.target.value
                                )
                              }
                              placeholder="Enter user email"
                              required
                            />

                          </div>

                          <div className="vault-field">

                            <label>
                              Permission
                            </label>

                            <select
                              value={
                                memberPermission
                              }
                              onChange={(e) =>
                                setMemberPermission(
                                  e.target.value
                                )
                              }
                            >

                              <option value="VIEW_ONLY">
                                View Only
                              </option>

                              <option value="EDIT">
                                Edit
                              </option>

                              <option value="FULL_MANAGEMENT">
                                Full Management
                              </option>

                            </select>

                          </div>

                        </div>

                        <div className="form-actions">

                          <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                              setMemberEmail("");
                              setMemberPermission(
                                "VIEW_ONLY"
                              );
                              setShowAddMemberForm(
                                false
                              );
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="save-button"
                            disabled={
                              memberLoading
                            }
                          >
                            {memberLoading
                              ? "Adding..."
                              : "Add Member"}
                          </button>

                        </div>

                      </form>

                    </div>
                  )}

                  {/* ADD TEAM CREDENTIAL FORM */}

                  {showAddTeamCredentialForm && (
                    <div className="credential-form-card">

                      <div className="form-heading">

                        <h3>
                          Add Credential to Team
                        </h3>

                        <p>
                          Select a credential from
                          your vault.
                        </p>

                      </div>

                      <form
                        onSubmit={
                          handleAddCredentialToTeam
                        }
                      >

                        <div className="vault-field">

                          <label>
                            Credential
                          </label>

                          <select
                            value={
                              selectedCredentialToAdd
                            }
                            onChange={(e) =>
                              setSelectedCredentialToAdd(
                                e.target.value
                              )
                            }
                            required
                          >

                            <option value="">
                              Select credential
                            </option>

                            {credentials.map(
                              (credential) => (

                                <option
                                  key={
                                    credential.id
                                  }
                                  value={
                                    credential.id
                                  }
                                >
                                  {
                                    credential.title
                                  }
                                </option>

                              )
                            )}

                          </select>

                        </div>

                        <div className="form-actions">

                          <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                              setSelectedCredentialToAdd(
                                ""
                              );
                              setShowAddTeamCredentialForm(
                                false
                              );
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="save-button"
                            disabled={
                              teamCredentialLoading
                            }
                          >
                            {teamCredentialLoading
                              ? "Adding..."
                              : "Add Credential"}
                          </button>

                        </div>

                      </form>

                    </div>
                  )}

                  {/* TEAM MEMBERS */}

                  <div className="team-members-section">

                    <div className="section-header-row">

                      <div>
                        <h3>
                          Team Members
                        </h3>

                        <p>
                          Manage access to this
                          team.
                        </p>
                      </div>

                    </div>

                    {teamMembers.length === 0 ? (

                      <div className="empty-small">
                        No team members found.
                      </div>

                    ) : (

                      <div className="members-list">

                        {teamMembers.map(
                          (member, index) => (

                            <div
                              className="member-row"
                              key={
                                member.id ||
                                member.user?.id ||
                                index
                              }
                            >

                              <div className="member-avatar">
                                {(member.user?.email ||
                                  member.email ||
                                  "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="member-info">

                                <strong>
                                  {
                                    member.user?.email ||
                                    member.email ||
                                    "User"
                                  }
                                </strong>

                                <span>
                                  {
                                    member.permissionLevel ||
                                    member.permission ||
                                    "VIEW_ONLY"
                                  }
                                </span>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                  {/* TEAM CREDENTIALS */}

                  <div className="team-credentials-section">

                    <div className="section-header-row">

                      <div>
                        <h3>
                          Team Credentials
                        </h3>

                        <p>
                          Credentials available
                          to this team.
                        </p>
                      </div>

                    </div>

                    {teamLoading ? (

                      <div className="loading-state">
                        <p>
                          Loading team credentials...
                        </p>
                      </div>

                    ) : teamCredentials.length === 0 ? (

                      <div className="empty-state">

                        <div className="empty-icon">
                          <Icon name="lock" />
                        </div>

                        <h3>
                          No team credentials
                        </h3>

                        <p>
                          Add a credential to
                          this team.
                        </p>

                      </div>

                    ) : (

                      <div className="credentials-grid">

                        {teamCredentials.map(
                          (credential, index) => (

                            <div
                              className="credential-card"
                              key={
                                credential.id ||
                                credential.teamCredentialId ||
                                index
                              }
                            >

                              <div className="credential-card-header">

                                <div className="credential-title-area">

                                  <div className="credential-icon">
                                    <Icon name="key" />
                                  </div>

                                  <div>

                                    <h3>
                                      {
                                        credential.title ||
                                        "Team Credential"
                                      }
                                    </h3>

                                    <span className="credential-category">
                                      {
                                        credential.category ||
                                        "General"
                                      }
                                    </span>

                                  </div>

                                </div>

                              </div>

                              <div className="credential-details">

                                <div className="credential-detail-row">

                                  <span>
                                    Username
                                  </span>

                                  <strong>
                                    {
                                      credential.username ||
                                      "—"
                                    }
                                  </strong>

                                </div>

                                <div className="credential-detail-row">

                                  <span>
                                    Password
                                  </span>

                                  <strong>
                                    ••••••••••••
                                  </strong>

                                </div>

                              </div>

                              <div className="credential-actions">

                                {canEditTeamCredential && (

                                  <button
                                    type="button"
                                    className="edit-button"
                                    onClick={() => {

                                      setEditingCredential(
                                        {
                                          ...credential,
                                          teamId:
                                            selectedTeam.id,
                                          teamCredentialId:
                                            credential.id ||
                                            credential.teamCredentialId,
                                        }
                                      );

                                      setTitle(
                                        credential.title ||
                                          ""
                                      );

                                      setUsername(
                                        credential.username ||
                                          ""
                                      );

                                      setPassword(
                                        credential.password ||
                                          ""
                                      );

                                      setUrl(
                                        credential.url ||
                                          ""
                                      );

                                      setNotes(
                                        credential.notes ||
                                          ""
                                      );

                                      setCategory(
                                        credential.category ||
                                          "General"
                                      );

                                      setCredentialType(
                                        credential.credentialType ||
                                          "LOGIN"
                                      );

                                      setTags(
                                        credential.tags ||
                                          ""
                                      );

                                      setShowForm(true);

                                      window.scrollTo({
                                        top: 0,
                                        behavior:
                                          "smooth",
                                      });

                                    }}
                                  >
                                    <><Icon name="edit" size={14} /> Edit</>
                                  </button>

                                )}

                                {canDeleteTeamCredential && (

                                  <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() =>
                                      handleDeleteTeamCredential(
                                        credential.id ||
                                          credential.teamCredentialId
                                      )
                                    }
                                  >
                                    <><Icon name="trash" size={14} /> Delete</>
                                  </button>

                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </>

              )}

            </section>

          )}

        </div>

      </main>

    </div>
  );
}

export default Vault;
