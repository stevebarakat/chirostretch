#!/bin/bash

set -e

FORM_ID=16  # Using the existing form

echo "Adding fields to Form ID: $FORM_ID"

# Page 1: Contact Information
wp gf field create $FORM_ID text "First Name" --field-json='{"isRequired":true,"adminLabel":"first_name"}'
wp gf field create $FORM_ID text "Last Name" --field-json='{"isRequired":true,"adminLabel":"last_name"}'
wp gf field create $FORM_ID email "Email" --field-json='{"isRequired":true,"adminLabel":"email"}'
wp gf field create $FORM_ID phone "Phone" --field-json='{"isRequired":true,"adminLabel":"phone"}'
wp gf field create $FORM_ID radio "Preferred Contact Method" --field-json='{"isRequired":true,"adminLabel":"contact_method","choices":[{"text":"Email","value":"Email"},{"text":"Phone","value":"Phone"},{"text":"Text","value":"Text"}]}'
wp gf field create $FORM_ID text "Country" --field-json='{"isRequired":true,"adminLabel":"country"}'
wp gf field create $FORM_ID text "State / Province" --field-json='{"isRequired":true,"adminLabel":"state"}'
wp gf field create $FORM_ID text "City" --field-json='{"isRequired":true,"adminLabel":"city"}'
wp gf field create $FORM_ID select "How did you hear about ChiroStretch?" --field-json='{"adminLabel":"lead_source","choices":[{"text":"Google","value":"Google"},{"text":"Facebook","value":"Facebook"},{"text":"Instagram","value":"Instagram"},{"text":"Referral","value":"Referral"},{"text":"Event","value":"Event"},{"text":"Other","value":"Other"}]}'
wp gf field create $FORM_ID page "Professional Background"

# Page 2: Professional Background
wp gf field create $FORM_ID radio "Are you a licensed chiropractor?" --field-json='{"adminLabel":"licensed_chiro","choices":[{"text":"Yes","value":"Yes"},{"text":"No","value":"No"}]}'
wp gf field create $FORM_ID text "License Number" --field-json='{"adminLabel":"license_number","visibility":"hidden"}'
wp gf field create $FORM_ID text "License State" --field-json='{"adminLabel":"license_state","visibility":"hidden"}'
wp gf field create $FORM_ID number "Years in Practice" --field-json='{"adminLabel":"license_years","visibility":"hidden"}'
wp gf field create $FORM_ID text "Current Occupation" --field-json='{"adminLabel":"occupation"}'
wp gf field create $FORM_ID radio "Experience running a business?" --field-json='{"adminLabel":"business_experience","choices":[{"text":"Yes","value":"Yes"},{"text":"No","value":"No"}]}'
wp gf field create $FORM_ID textarea "Describe your previous business experience" --field-json='{"adminLabel":"business_experience_desc","visibility":"hidden"}'
wp gf field create $FORM_ID textarea "Experience in health, wellness, or fitness?" --field-json='{"adminLabel":"industry_experience"}'
wp gf field create $FORM_ID page "Financial Readiness"

# Page 3: Financial Readiness
wp gf field create $FORM_ID select "Estimated Liquid Capital" --field-json='{"adminLabel":"liquid_capital","choices":[{"text":"< $25k","value":"< $25k"},{"text":"$25k–$50k","value":"$25k–$50k"},{"text":"$50k–$100k","value":"$50k–$100k"},{"text":"$100k+","value":"$100k+"}]}'
wp gf field create $FORM_ID select "Estimated Net Worth" --field-json='{"adminLabel":"net_worth","choices":[{"text":"< $100k","value":"< $100k"},{"text":"$100k–$250k","value":"$100k–$250k"},{"text":"$250k–$500k","value":"$250k–$500k"},{"text":"$500k–$1M","value":"$500k–$1M"},{"text":"$1M+","value":"$1M+"}]}'
wp gf field create $FORM_ID radio "Timeline to Invest" --field-json='{"adminLabel":"invest_timeline","choices":[{"text":"ASAP","value":"ASAP"},{"text":"3–6 months","value":"3–6 months"},{"text":"6–12 months","value":"6–12 months"},{"text":"Not sure","value":"Not sure"}]}'
wp gf field create $FORM_ID radio "Are you seeking financing?" --field-json='{"adminLabel":"seeking_financing","choices":[{"text":"Yes","value":"Yes"},{"text":"No","value":"No"}]}'
wp gf field create $FORM_ID page "Market & Opportunity"

# Page 4: Market & Opportunity
wp gf field create $FORM_ID text "Desired Market / City" --field-json='{"adminLabel":"desired_market"}'
wp gf field create $FORM_ID radio "Are you open to alternative locations?" --field-json='{"adminLabel":"alt_locations","choices":[{"text":"Yes","value":"Yes"},{"text":"No","value":"No"}]}'
wp gf field create $FORM_ID radio "Will you operate one or multiple clinics?" --field-json='{"adminLabel":"clinic_units","choices":[{"text":"One","value":"One"},{"text":"Multi-Unit","value":"Multi-Unit"}]}'
wp gf field create $FORM_ID radio "Will you operate the clinic or hire a manager?" --field-json='{"adminLabel":"ownership_style","choices":[{"text":"Operate Myself","value":"Operate Myself"},{"text":"Hire Manager","value":"Hire Manager"}]}'
wp gf field create $FORM_ID page "Motivation & Fit"

# Page 5: Motivation & Fit
wp gf field create $FORM_ID textarea "Why are you interested in owning a ChiroStretch clinic?" --field-json='{"adminLabel":"motivation","isRequired":true}'
wp gf field create $FORM_ID textarea "What strengths do you bring as an owner/operator?" --field-json='{"adminLabel":"strengths","isRequired":true}'
wp gf field create $FORM_ID radio "Have you explored other franchises?" --field-json='{"adminLabel":"other_franchises","choices":[{"text":"Yes","value":"Yes"},{"text":"No","value":"No"}]}'
wp gf field create $FORM_ID textarea "Anything else we should know?" --field-json='{"adminLabel":"additional_info"}'
wp gf field create $FORM_ID page "Final Review"

# Page 6: Final Review
wp gf field create $FORM_ID checkbox "Agreements" --field-json='{"adminLabel":"agreements","isRequired":true,"choices":[{"text":"I understand this is not a binding agreement","value":"not_binding"},{"text":"I agree to be contacted about franchise opportunities","value":"contact_agreement"}]}'

# Hidden tracking fields
wp gf field create $FORM_ID hidden "UTM Source" --field-json='{"adminLabel":"utm_source"}'
wp gf field create $FORM_ID hidden "UTM Campaign" --field-json='{"adminLabel":"utm_campaign"}'
wp gf field create $FORM_ID hidden "UTM Medium" --field-json='{"adminLabel":"utm_medium"}'
wp gf field create $FORM_ID hidden "Referrer" --field-json='{"adminLabel":"referrer"}'

echo "✓ Franchise Application Form fields created successfully!"
echo "Note: Conditional logic needs to be added manually in WordPress Admin"
echo "Form URL: https://chirostretch-copy.local/wp-admin/admin.php?page=gf_edit_forms&id=$FORM_ID"
