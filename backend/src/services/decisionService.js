/**
 * Evaluates the employee's intent, entities, and retrieved policies to make a strict deterministic business decision.
 * Allowed decisions: RESOLVE, FOLLOW_UP, ESCALATE.
 * 
 * Rules strictly follow the Assignment 2 PDF.
 */
const makeDecision = (intent, entities, policies) => {
  const sourcePolicyIds = policies.map(p => p.policyId);

  // 1. Phishing / Security
  if (intent === "PHISHING_REPORT" || intent === "SECURITY_INCIDENT") {
    return {
      decision: "ESCALATE",
      reason: "Suspected phishing, malware, or unauthorized access must be escalated immediately to Security.",
      sourcePolicyIds
    };
  }

  // 2. Password Reset
  if (intent === "PASSWORD_RESET") {
    const isLockedOut = entities && entities.attempts_made && entities.attempts_made >= 5;
    if (isLockedOut || (entities && entities.is_locked === true)) {
      return {
        decision: "ESCALATE",
        reason: "Account is locked out after 5+ failed attempts. Manual IT unlock is required.",
        sourcePolicyIds
      };
    }
    return {
      decision: "RESOLVE",
      reason: "Employees can reset their own password via self-service at any time without approval.",
      sourcePolicyIds
    };
  }

  // 3. VPN Access
  if (intent === "VPN_ACCESS") {
    if (entities && entities.employee_type === "contractor" && !entities.manager_approval) {
      return {
        decision: "FOLLOW_UP",
        reason: "Contractors require manager approval through the access request form. Please provide manager approval.",
        sourcePolicyIds
      };
    }
    if (entities && entities.issue === "expired") {
      return {
        decision: "RESOLVE",
        reason: "VPN credentials expire every 90 days and must be renewed. Providing renewal instructions.",
        sourcePolicyIds
      };
    }
    // If not specified if contractor or full-time, ask.
    if (!entities || !entities.employee_type) {
      return {
        decision: "FOLLOW_UP",
        reason: "Please clarify if you are a full-time employee or a contractor.",
        sourcePolicyIds
      };
    }
    return {
      decision: "RESOLVE",
      reason: "Full-time employees get VPN automatically.",
      sourcePolicyIds
    };
  }

  // 4. Guest Wi-Fi
  if (intent === "GUEST_WIFI") {
    return {
      decision: "RESOLVE",
      reason: "Any employee can generate Guest Wi-Fi credentials valid for 24 hours at the front-desk kiosk. No IT ticket required.",
      sourcePolicyIds
    };
  }

  // 5. Mailbox Quota
  if (intent === "QUOTA_INCREASE") {
    const requestedAmount = entities ? entities.requested_amount_gb : null;
    if (!requestedAmount) {
      return {
        decision: "FOLLOW_UP",
        reason: "Please specify the required quota amount. Default is 25GB. Max is 50GB.",
        sourcePolicyIds
      };
    }
    if (requestedAmount > 50) {
      return {
        decision: "RESOLVE",
        reason: "Maximum allowed mailbox quota is 50GB. Cannot fulfill request.",
        sourcePolicyIds
      };
    }
    if (requestedAmount > 25 && (!entities || !entities.manager_approval)) {
      return {
        decision: "FOLLOW_UP",
        reason: "Increases above 25GB require manager approval. Please provide manager approval.",
        sourcePolicyIds
      };
    }
    return {
      decision: "RESOLVE",
      reason: "Quota increase request approved within limits.",
      sourcePolicyIds
    };
  }

  // 6. Laptop / Hardware
  if (intent === "LAPTOP_ISSUE") {
    const age = entities ? entities.hardware_age_years : null;
    const isDead = entities ? entities.is_dead : false;
    
    if (!age && !isDead) {
      return {
        decision: "FOLLOW_UP",
        reason: "Please provide the age of the laptop or confirm if it is a verified hardware failure.",
        sourcePolicyIds
      };
    }
    if (age >= 3 || isDead) {
      return {
        decision: "RESOLVE",
        reason: "Eligible for replacement (3 years of service or verified hardware failure).",
        sourcePolicyIds
      };
    }
    return {
      decision: "ESCALATE",
      reason: "Early replacement outside the cycle requires Finance sign-off in addition to IT approval.",
      sourcePolicyIds
    };
  }

  // Fallback for vague or unknown requests
  return {
    decision: "FOLLOW_UP",
    reason: "Information is missing, unclear, or request intent is vague. Asking for more details.",
    sourcePolicyIds
  };
};

module.exports = {
  makeDecision
};
