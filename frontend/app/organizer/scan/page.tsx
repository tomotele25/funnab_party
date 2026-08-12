"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { CheckCircle2, XCircle, ScanLine } from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ScanResult {
  ok: boolean;
  message: string;
  buyerName?: string;
  ticketType?: string;
  ticketId?: string;
}

export default function ScanPage() {
  const { data: session } = useSession();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const busyRef = useRef(false);

  const handleDecoded = useCallback(
    async (decodedText: string) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setScanning(false);

      try {
        const res = await axios.post(
          `${BACKENDURL}/api/scan/validate`,
          { qrToken: decodedText },
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );

        setResult({
          ok: true,
          message: res.data.message,
          buyerName: res.data.ticket?.buyerName,
          ticketType: res.data.ticket?.ticketType,
          ticketId: res.data.ticket?.ticketId,
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setResult({
            ok: false,
            message: err.response?.data?.message || "Invalid ticket.",
          });
        } else {
          setResult({ ok: false, message: "Scan failed." });
        }
      }
    },
    [session?.user?.accessToken]
  );

  useEffect(() => {
    if (!scanning) return;

    let cancelled = false;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled) return;
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            handleDecoded(decodedText);
          },
          () => {}
        )
        .catch((err) => {
          console.error("Failed to start scanner:", err);
        });
    });

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning, handleDecoded]);

  const scanNext = () => {
    setResult(null);
    busyRef.current = false;
    setScanning(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-center p-4">
      <h1
        className="text-xl font-bold mb-4 flex items-center gap-2"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        <ScanLine className="w-6 h-6" />
        Scan Ticket
      </h1>

      {scanning && (
        <div
          id="qr-reader"
          className="w-full max-w-sm rounded-[var(--radius-card)] overflow-hidden border border-[var(--color-border)]"
        />
      )}

      {result && (
        <div
          className={`w-full max-w-sm rounded-[var(--radius-card)] p-6 text-center ${
            result.ok ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="w-16 h-16 mx-auto mb-3" />
          ) : (
            <XCircle className="w-16 h-16 mx-auto mb-3" />
          )}
          <p className="text-lg font-bold mb-2">
            {result.ok ? "VALID TICKET" : "INVALID TICKET"}
          </p>
          <p className="mb-1">{result.message}</p>
          {result.ok && (
            <>
              <p className="text-sm">Ticket: {result.ticketId}</p>
              <p className="text-sm">Type: {result.ticketType}</p>
              <p className="text-sm">Holder: {result.buyerName}</p>
            </>
          )}

          <button
            onClick={scanNext}
            className="mt-4 w-full px-4 py-2 bg-white text-[var(--color-bg)] font-semibold rounded-[var(--radius-btn)]"
          >
            Scan Next
          </button>
        </div>
      )}
    </div>
  );
}
