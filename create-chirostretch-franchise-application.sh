#!/bin/bash

set -e

FORM_TITLE="ChiroStretch Franchise Application"

# 1. Create the form
FORM_ID=$(wp gf form create "$FORM_TITLE" --porcelain)
echo "Created form ID: $FORM_ID"

# -------------------------------------------------------------------
# PAGE 1 — CONTACT INFORMATION
# -------------------------------------------------------------------

# Page Break (Start)
wp gf field create $FORM_ID --type=page --label="Start Page" --pageNumber=1 --porcelain

wp gf field create $FORM_ID --label="First Name" --type="text" --required=1 --adminLabel="first_name" --porcelain
wp gf field create $FORM_ID --label="Last Name" --type="text" --required=1 --adminLabel="last_name" --porcelain
wp gf field create $FORM_ID --label="Email" --type="email" --required=1 --adminLabel="email" --porcelain
wp gf field create $FORM_ID --label="Phone" --type="phone" --required=1 --adminLabel="phone" --porcelain

wp gf field create $FORM_ID --label="Preferred Contact Method" --type="radio" \
  --choices="Email,Phone,Text" --required=1 --adminLabel="contact_method" --porcelain

wp gf field create $FORM_ID --label="Country" --type="text" --required=1 --adminLabel="country" --porcelain
wp gf field create $FORM_ID --label="State / Province" --type="text" --required=1 --adminLabel="state" --porcelain
wp gf field create $FORM_ID --label="City" --type="text" --required=1 --adminLabel="city" --porcelain

wp gf field create $FORM_ID --label="How did you hear about ChiroStretch?" --type="select" \
  --choices="Google,Facebook,Instagram,Referral,Event,Other" --adminLabel="lead_source" --porcelain

# Page Break (End Page 1)
wp gf field create $FORM_ID --type=page --label="Next" --pageNumber=1 --porcelain

# -------------------------------------------------------------------
# PAGE 2 — PROFESSIONAL BACKGROUND
# -------------------------------------------------------------------

# Page Break (Start Page 2)
wp gf field create $FORM_ID --type=page --label="Professional Background" --pageNumber=2 --porcelain

LICENSE_FIELD=$(wp gf field create $FORM_ID --label="Are you a licensed chiropractor?" --type="radio" \
  --choices="Yes,No" --adminLabel="licensed_chiro" --porcelain)

LICENSE_NUMBER_FIELD=$(wp gf field create $FORM_ID --label="License Number" --type="text" \
  --adminLabel="license_number" --visibility="hidden" --porcelain)

LICENSE_STATE_FIELD=$(wp gf field create $FORM_ID --label="License State" --type="text" \
  --adminLabel="license_state" --visibility="hidden" --porcelain)

LICENSE_YEARS_FIELD=$(wp gf field create $FORM_ID --label="Years in Practice" --type="number" \
  --adminLabel="license_years" --visibility="hidden" --porcelain)

wp gf field create $FORM_ID --label="Current Occupation" --type="text" --adminLabel="occupation" --porcelain

BUSINESS_EXP_FIELD=$(wp gf field create $FORM_ID --label="Experience running a business?" --type="radio" \
  --choices="Yes,No" --adminLabel="business_experience" --porcelain)

BUSINESS_DESC_FIELD=$(wp gf field create $FORM_ID --label="Describe your previous business experience" \
  --type="textarea" --adminLabel="business_experience_desc" --visibility="hidden" --porcelain)

wp gf field create $FORM_ID --label="Experience in health, wellness, or fitness?" \
  --type="textarea" --adminLabel="industry_experience" --porcelain

# Conditional Logic for License fields
wp gf field update $FORM_ID $LICENSE_NUMBER_FIELD --conditionalLogic='{"actionType":"show","logicType":"all","rules":[{"fieldId":"'"$LICENSE_FIELD"'","operator":"is","value":"Yes"}]}'
wp gf field update $FORM_ID $LICENSE_STATE_FIELD --conditionalLogic='{"actionType":"show","logicType":"all","rules":[{"fieldId":"'"$LICENSE_FIELD"'","operator":"is","value":"Yes"}]}'
wp gf field update $FORM_ID $LICENSE_YEARS_FIELD --conditionalLogic='{"actionType":"show","logicType":"all","rules":[{"fieldId":"'"$LICENSE_FIELD"'","operator":"is","value":"Yes"}]}'

# Conditional Logic for business fields
wp gf field update $FORM_ID $BUSINESS_DESC_FIELD --conditionalLogic='{"actionType":"show","logicType":"all","rules":[{"fieldId":"'"$BUSINESS_EXP_FIELD"'","operator":"is","value":"Yes"}]}'

# Page Break (End Page 2)
wp gf field create $FORM_ID --type=page --label="Next" --pageNumber=2 --porcelain

# -------------------------------------------------------------------
# PAGE 3 — FINANCIAL READINESS
# -------------------------------------------------------------------

wp gf field create $FORM_ID --type=page --label="Financial Readiness" --pageNumber=3 --porcelain

wp gf field create $FORM_ID --label="Estimated Liquid Capital" --type="select" \
  --choices="< $25k,$25k–$50k,$50k–$100k,$100k+" --adminLabel="liquid_capital" --porcelain

wp gf field create $FORM_ID --label="Estimated Net Worth" --type="select" \
  --choices="< $100k,$100k–$250k,$250k–$500k,$500k–$1M,$1M+" --adminLabel="net_worth" --porcelain

wp gf field create $FORM_ID --label="Timeline to Invest" --type="radio" \
  --choices="ASAP,3–6 months,6–12 months,Not sure" --adminLabel="invest_timeline" --porcelain

wp gf field create $FORM_ID --label="Are you seeking financing?" --type="radio" \
  --choices="Yes,No" --adminLabel="seeking_financing" --porcelain

wp gf field create $FORM_ID --type=page --label="Next" --pageNumber=3 --porcelain

# -------------------------------------------------------------------
# PAGE 4 — MARKET & OPPORTUNITY
# -------------------------------------------------------------------

wp gf field create $FORM_ID --type=page --label="Market & Opportunity" --pageNumber=4 --porcelain

wp gf field create $FORM_ID --label="Desired Market / City" --type="text" --adminLabel="desired_market" --porcelain

wp gf field create $FORM_ID --label="Are you open to alternative locations?" --type="radio" \
  --choices="Yes,No" --adminLabel="alt_locations" --porcelain

wp gf field create $FORM_ID --label="Will you operate one or multiple clinics?" --type="radio" \
  --choices="One,Multi-Unit" --adminLabel="clinic_units" --porcelain

wp gf field create $FORM_ID --label="Will you operate the clinic or hire a manager?" --type="radio" \
  --choices="Operate Myself,Hire Manager" --adminLabel="ownership_style" --porcelain

wp gf field create $FORM_ID --type=page --label="Next" --pageNumber=4 --porcelain

# -------------------------------------------------------------------
# PAGE 5 — MOTIVATION & FIT
# -------------------------------------------------------------------

wp gf field create $FORM_ID --type=page --label="Motivation & Fit" --pageNumber=5 --porcelain

wp gf field create $FORM_ID --label="Why are you interested in owning a ChiroStretch clinic?" \
  --type="textarea" --adminLabel="motivation" --required=1 --porcelain

wp gf field create $FORM_ID --label="What strengths do you bring as an owner/operator?" \
  --type="textarea" --adminLabel="strengths" --required=1 --porcelain

wp gf field create $FORM_ID --label="Have you explored other franchises?" --type="radio" \
  --choices="Yes,No" --adminLabel="other_franchises" --porcelain

wp gf field create $FORM_ID --label="Anything else we should know?" --type="textarea" \
  --adminLabel="additional_info" --porcelain

wp gf field create $FORM_ID --type=page --label="Next" --pageNumber=5 --porcelain

# -------------------------------------------------------------------
# PAGE 6 — FINAL REVIEW
# -------------------------------------------------------------------

wp gf field create $FORM_ID --type=page --label="Final Review" --pageNumber=6 --porcelain

wp gf field create $FORM_ID --label="I understand this is not a binding agreement." \
  --type="checkbox" --choices="Yes" --required=1 --adminLabel="not_binding" --porcelain

wp gf field create $FORM_ID --label="I agree to be contacted about franchise opportunities." \
  --type="checkbox" --choices="Yes" --required=1 --adminLabel="contact_agreement" --porcelain

# Hidden tracking fields
wp gf field create $FORM_ID --label="UTM Source" --type="hidden" --adminLabel="utm_source" --porcelain
wp gf field create $FORM_ID --label="UTM Campaign" --type="hidden" --adminLabel="utm_campaign" --porcelain
wp gf field create $FORM_ID --label="UTM Medium" --type="hidden" --adminLabel="utm_medium" --porcelain
wp gf field create $FORM_ID --label="Referrer" --type="hidden" --adminLabel="referrer" --porcelain

# -------------------------------------------------------------------
# CONFIRMATION MESSAGE
# -------------------------------------------------------------------

wp gf confirmation create $FORM_ID \
  --name="Default Confirmation" \
  --type="message" \
  --message="Thank you for submitting your Franchise Application. Our team will review your information and reach out soon." >/dev/null

echo "Franchise Application Form Created Successfully (Form ID: $FORM_ID)"
