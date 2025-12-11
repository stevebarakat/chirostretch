"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import Button from "@/components/ui/Button";
import styles from "./CheckoutForm.module.css";
import { type CheckoutFormData, checkoutFormSchema } from "./checkoutSchema";
import { formatPrice } from "@/lib/utils/formatPrice";

export default function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      billing: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        postcode: "",
        country: "US",
      },
      shipping: {
        first_name: "",
        last_name: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        postcode: "",
        country: "US",
      },
      payment_method: "stripe",
      shipping_method: [],
      sameAsBilling: true,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const sameAsBilling = watch("sameAsBilling");
  // eslint-disable-next-line react-hooks/incompatible-library
  const billingData = watch("billing");
  // eslint-disable-next-line react-hooks/incompatible-library
  const shippingData = watch("shipping");
  const [cardError, setCardError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [shippingRates, setShippingRates] = useState<
    Array<{
      rate_id: string;
      name: string;
      price: string;
      description?: string;
    }>
  >([]);
  const [loadingShippingRates, setLoadingShippingRates] = useState(false);
  const [selectedShippingRateId, setSelectedShippingRateId] = useState<
    string | null
  >(null);

  const updateShippingAddressAndFetchRates = useCallback(
    async (shippingAddress: CheckoutFormData["shipping"]) => {
      const hasRequiredFields =
        shippingAddress.address_1 &&
        shippingAddress.city &&
        shippingAddress.state &&
        shippingAddress.postcode &&
        shippingAddress.country;

      if (!hasRequiredFields) {
        return;
      }

      setLoadingShippingRates(true);
      try {
        const addressPayload = {
          shipping_address: {
            first_name: shippingAddress.first_name || "",
            last_name: shippingAddress.last_name || "",
            address_1: shippingAddress.address_1,
            address_2: shippingAddress.address_2 || "",
            city: shippingAddress.city,
            state: shippingAddress.state,
            postcode: shippingAddress.postcode,
            country: shippingAddress.country,
          },
          billing_address: {
            first_name: billingData.first_name || "",
            last_name: billingData.last_name || "",
            email: billingData.email || "",
            phone: billingData.phone || "",
            address_1: billingData.address_1 || "",
            address_2: billingData.address_2 || "",
            city: billingData.city || "",
            state: billingData.state || "",
            postcode: billingData.postcode || "",
            country: billingData.country || "",
          },
        };

        console.log("Updating cart with addresses:", addressPayload);

        const updateResponse = await fetch(
          "/api/cart/update-shipping-address",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(addressPayload),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error("Failed to update shipping address:", errorData);
          return;
        }

        await updateResponse.json();

        await new Promise((resolve) => setTimeout(resolve, 300));

        const ratesResponse = await fetch("/api/cart/shipping-rates", {
          credentials: "include",
        });
        const ratesData = await ratesResponse.json();

        console.log(
          "Shipping rates response:",
          JSON.stringify(ratesData, null, 2)
        );

        if (ratesResponse.ok) {
          let rates: Array<{
            rate_id: string;
            name: string;
            price: string;
            description?: string;
          }> = [];

          if (ratesData.shipping_rates) {
            if (Array.isArray(ratesData.shipping_rates)) {
              rates = ratesData.shipping_rates.flatMap(
                (pkg: {
                  shipping_rates?: Array<{
                    rate_id: string;
                    name: string;
                    price: string;
                    description?: string;
                  }>;
                }) => {
                  if (pkg.shipping_rates && Array.isArray(pkg.shipping_rates)) {
                    return pkg.shipping_rates;
                  }
                  return [];
                }
              );
            }
          }

          console.log("Parsed shipping rates:", rates);

          setShippingRates(rates);
          if (rates.length > 0 && !selectedShippingRateId) {
            setSelectedShippingRateId(rates[0].rate_id);
            setValue("shipping_method", [rates[0].rate_id]);
          } else if (rates.length === 0) {
            console.warn("No shipping rates found in response:", ratesData);
          }
        } else {
          console.error("Shipping rates response error:", ratesData);
        }
      } catch (error) {
        console.error("Error updating address and fetching rates:", error);
      } finally {
        setLoadingShippingRates(false);
      }
    },
    [selectedShippingRateId, setValue]
  );

  useEffect(() => {
    const shippingAddress = sameAsBilling ? billingData : shippingData;

    const timeoutId = setTimeout(() => {
      updateShippingAddressAndFetchRates(shippingAddress);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    sameAsBilling,
    billingData,
    shippingData,
    updateShippingAddressAndFetchRates,
  ]);

  useEffect(() => {
    if (sameAsBilling) {
      setValue("shipping.first_name", billingData.first_name);
      setValue("shipping.last_name", billingData.last_name);
      setValue("shipping.address_1", billingData.address_1);
      setValue("shipping.address_2", billingData.address_2 || "");
      setValue("shipping.city", billingData.city);
      setValue("shipping.state", billingData.state);
      setValue("shipping.postcode", billingData.postcode);
      setValue("shipping.country", billingData.country);
    }
  }, [
    sameAsBilling,
    billingData.first_name,
    billingData.last_name,
    billingData.address_1,
    billingData.address_2,
    billingData.city,
    billingData.state,
    billingData.postcode,
    billingData.country,
    setValue,
  ]);

  function handleCardChange(e: StripeCardElementChangeEvent) {
    if (e.error) {
      setCardError(e.error.message);
    } else {
      setCardError(null);
    }
  }

  async function onSubmit(data: CheckoutFormData) {
    if (!stripe || !elements) {
      setSubmitError("Stripe is not loaded. Please refresh the page.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setSubmitError("Card element not found. Please refresh the page.");
      return;
    }

    if (!selectedShippingRateId) {
      setSubmitError("Please select a shipping method.");
      return;
    }

    setSubmitError(null);
    setCardError(null);

    try {
      const selectShippingResponse = await fetch(
        "/api/cart/select-shipping-rate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ rate_id: selectedShippingRateId }),
        }
      );

      if (!selectShippingResponse.ok) {
        const errorData = await selectShippingResponse.json();
        setSubmitError(
          errorData.message ||
            "Failed to select shipping method. Please try again."
        );
        return;
      }
    } catch (error) {
      console.error("Error selecting shipping rate:", error);
      setSubmitError("Failed to select shipping method. Please try again.");
      return;
    }

    try {
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: `${data.billing.first_name} ${data.billing.last_name}`,
            email: data.billing.email,
            phone: data.billing.phone,
            address: {
              line1: data.billing.address_1,
              line2: data.billing.address_2 || undefined,
              city: data.billing.city,
              state: data.billing.state,
              postal_code: data.billing.postcode,
              country: data.billing.country,
            },
          },
        });

      if (pmError) {
        setSubmitError(pmError.message || "Failed to process card information");
        return;
      }

      if (!paymentMethod) {
        setSubmitError("Failed to create payment method");
        return;
      }

      const paymentData = [
        {
          key: "stripe_source",
          value: paymentMethod.id,
        },
        {
          key: "wc-stripe-payment-method",
          value: paymentMethod.id,
        },
        {
          key: "paymentMethod",
          value: "stripe",
        },
        {
          key: "paymentRequestType",
          value: "cc",
        },
        {
          key: "billing_email",
          value: data.billing.email,
        },
        {
          key: "billing_first_name",
          value: data.billing.first_name,
        },
        {
          key: "billing_last_name",
          value: data.billing.last_name,
        },
        {
          key: "billing_name",
          value: `${data.billing.first_name} ${data.billing.last_name}`,
        },
        {
          key: "billing_address_1",
          value: data.billing.address_1,
        },
        {
          key: "billing_address_2",
          value: data.billing.address_2 || "",
        },
        {
          key: "billing_city",
          value: data.billing.city,
        },
        {
          key: "billing_state",
          value: data.billing.state,
        },
        {
          key: "billing_postcode",
          value: data.billing.postcode,
        },
        {
          key: "billing_country",
          value: data.billing.country,
        },
        {
          key: "billing_phone",
          value: data.billing.phone,
        },
      ];

      // Ensure shipping address has email and phone for WooCommerce
      const shippingAddress = sameAsBilling
        ? data.billing
        : {
            ...data.shipping,
            email: data.billing.email,
            phone: data.billing.phone,
          };

      const requestBody = {
        billing_address: data.billing,
        shipping_address: shippingAddress,
        payment_method: data.payment_method,
        payment_data: paymentData,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Checkout API error - Status:", response.status);
        console.error(
          "Checkout API error - Response:",
          JSON.stringify(responseData, null, 2)
        );
        console.error(
          "Checkout API error - Request:",
          JSON.stringify(requestBody, null, 2)
        );

        let errorMessage = "An error occurred during checkout";

        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors)
            .flat()
            .filter(
              (msg): msg is string => typeof msg === "string" && msg.length > 0
            );
          errorMessage = errorMessages[0] || errorMessage;
        } else if (responseData.error) {
          errorMessage =
            typeof responseData.error === "string"
              ? responseData.error
              : errorMessage;
        } else if (responseData.code) {
          errorMessage = `${responseData.code}: ${
            responseData.message || errorMessage
          }`;
        }

        setSubmitError(errorMessage);
        return;
      }

      if (responseData.redirect_url) {
        window.location.href = responseData.redirect_url;
        return;
      }

      if (responseData.order_id || responseData.order_number) {
        const orderId = responseData.order_id || responseData.order_number;
        router.push(`/checkout/success?order=${orderId}`);
        return;
      }

      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.checkoutForm}>
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Billing Information</h2>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="billing.first_name" className={styles.label}>
              First Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="billing.first_name"
              {...register("billing.first_name")}
              className={styles.input}
            />
            {errors.billing?.first_name && (
              <span className={styles.error}>
                {errors.billing.first_name.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="billing.last_name" className={styles.label}>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="billing.last_name"
              {...register("billing.last_name")}
              className={styles.input}
            />
            {errors.billing?.last_name && (
              <span className={styles.error}>
                {errors.billing.last_name.message}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="billing.email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="billing.email"
            {...register("billing.email")}
            className={styles.input}
          />
          {errors.billing?.email && (
            <span className={styles.error}>{errors.billing.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="billing.phone" className={styles.label}>
            Phone <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            id="billing.phone"
            {...register("billing.phone")}
            className={styles.input}
          />
          {errors.billing?.phone && (
            <span className={styles.error}>{errors.billing.phone.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="billing.address_1" className={styles.label}>
            Address <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="billing.address_1"
            {...register("billing.address_1")}
            className={styles.input}
          />
          {errors.billing?.address_1 && (
            <span className={styles.error}>
              {errors.billing.address_1.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="billing.address_2" className={styles.label}>
            Address Line 2
          </label>
          <input
            type="text"
            id="billing.address_2"
            {...register("billing.address_2")}
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="billing.city" className={styles.label}>
              City <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="billing.city"
              {...register("billing.city")}
              className={styles.input}
            />
            {errors.billing?.city && (
              <span className={styles.error}>
                {errors.billing.city.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="billing.state" className={styles.label}>
              State <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="billing.state"
              {...register("billing.state")}
              className={styles.input}
            />
            {errors.billing?.state && (
              <span className={styles.error}>
                {errors.billing.state.message}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="billing.postcode" className={styles.label}>
              Postal Code <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="billing.postcode"
              {...register("billing.postcode")}
              className={styles.input}
            />
            {errors.billing?.postcode && (
              <span className={styles.error}>
                {errors.billing.postcode.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="billing.country" className={styles.label}>
              Country <span className={styles.required}>*</span>
            </label>
            <select
              id="billing.country"
              {...register("billing.country")}
              className={styles.select}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
            {errors.billing?.country && (
              <span className={styles.error}>
                {errors.billing.country.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Shipping Information</h2>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register("sameAsBilling")}
              className={styles.checkbox}
            />
            <span>Same as billing address</span>
          </label>
        </div>

        {!sameAsBilling && (
          <>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="shipping.first_name" className={styles.label}>
                  First Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="shipping.first_name"
                  {...register("shipping.first_name")}
                  className={styles.input}
                />
                {errors.shipping?.first_name && (
                  <span className={styles.error}>
                    {errors.shipping.first_name.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="shipping.last_name" className={styles.label}>
                  Last Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="shipping.last_name"
                  {...register("shipping.last_name")}
                  className={styles.input}
                />
                {errors.shipping?.last_name && (
                  <span className={styles.error}>
                    {errors.shipping.last_name.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shipping.address_1" className={styles.label}>
                Address <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="shipping.address_1"
                {...register("shipping.address_1")}
                className={styles.input}
              />
              {errors.shipping?.address_1 && (
                <span className={styles.error}>
                  {errors.shipping.address_1.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shipping.address_2" className={styles.label}>
                Address Line 2
              </label>
              <input
                type="text"
                id="shipping.address_2"
                {...register("shipping.address_2")}
                className={styles.input}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="shipping.city" className={styles.label}>
                  City <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="shipping.city"
                  {...register("shipping.city")}
                  className={styles.input}
                />
                {errors.shipping?.city && (
                  <span className={styles.error}>
                    {errors.shipping.city.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="shipping.state" className={styles.label}>
                  State <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="shipping.state"
                  {...register("shipping.state")}
                  className={styles.input}
                />
                {errors.shipping?.state && (
                  <span className={styles.error}>
                    {errors.shipping.state.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="shipping.postcode" className={styles.label}>
                  Postal Code <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="shipping.postcode"
                  {...register("shipping.postcode")}
                  className={styles.input}
                />
                {errors.shipping?.postcode && (
                  <span className={styles.error}>
                    {errors.shipping.postcode.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="shipping.country" className={styles.label}>
                  Country <span className={styles.required}>*</span>
                </label>
                <select
                  id="shipping.country"
                  {...register("shipping.country")}
                  className={styles.select}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
                {errors.shipping?.country && (
                  <span className={styles.error}>
                    {errors.shipping.country.message}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Shipping Method <span className={styles.required}>*</span>
          </label>
          {loadingShippingRates ? (
            <div className={styles.loadingMessage}>
              Loading shipping options...
            </div>
          ) : shippingRates.length === 0 ? (
            <div className={styles.infoMessage}>
              {billingData.address_1 &&
              billingData.city &&
              billingData.state &&
              billingData.postcode
                ? "No shipping methods available for this address. This may mean: (1) No shipping zones are configured for this address, (2) Shipping methods are disabled, or (3) The address doesn't match any shipping zones. Please check your WooCommerce shipping settings or try a different address."
                : "Please enter your complete shipping address (address, city, state, postal code, and country) to see available shipping options."}
            </div>
          ) : (
            <div className={styles.shippingMethods}>
              {shippingRates.map((rate) => (
                <label
                  key={rate.rate_id}
                  className={`${styles.shippingMethodOption} ${
                    selectedShippingRateId === rate.rate_id
                      ? styles.shippingMethodOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping_method"
                    value={rate.rate_id}
                    checked={selectedShippingRateId === rate.rate_id}
                    onChange={(e) => {
                      setSelectedShippingRateId(e.target.value);
                      setValue("shipping_method", [e.target.value]);
                    }}
                    className={styles.radio}
                  />
                  <div className={styles.shippingMethodInfo}>
                    <span className={styles.shippingMethodName}>
                      {rate.name}
                    </span>
                    {rate.description && (
                      <span className={styles.shippingMethodDescription}>
                        {rate.description}
                      </span>
                    )}
                  </div>
                  <span className={styles.shippingMethodPrice}>
                    {formatPrice(rate.price)}
                  </span>
                </label>
              ))}
            </div>
          )}
          {!selectedShippingRateId && shippingRates.length > 0 && (
            <span className={styles.error}>
              Please select a shipping method
            </span>
          )}
        </div>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Payment Information</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Card Details <span className={styles.required}>*</span>
          </label>
          {!stripe || !elements ? (
            <div className={styles.cardElementWrapper}>
              <div className={styles.loadingMessage}>
                Loading payment form...
              </div>
            </div>
          ) : (
            <div className={styles.cardElementWrapper}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#171717",
                      "::placeholder": {
                        color: "#737373",
                      },
                    },
                    invalid: {
                      color: "#F44336",
                    },
                  },
                }}
                onChange={handleCardChange}
              />
            </div>
          )}
          {cardError && <span className={styles.error}>{cardError}</span>}
        </div>
      </div>

      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
