// component quét mã QR
"use client"

import { useState, useEffect, useRef } from "react" // Thêm useEffect, useRef
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, ScanLine } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Html5QrcodeScanner, Html5QrcodeResult, Html5Qrcode } from "html5-qrcode"

// Định nghĩa kiểu dữ liệu mong đợi từ QR code (phải khớp với QrCodeGenerator)
interface ScannedData {
  id: string;
  name: string;
  class: string;
  timestamp: number;
}

export function QrScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScannedData | null>(null); // Lưu kết quả quét cuối cùng
  const [scanCount, setScanCount] = useState(0) // Vẫn giữ nếu muốn đếm
  const { toast } = useToast()
  const scannerRef = useRef<Html5QrcodeScanner | null>(null); // <<< Lưu trữ instance của scanner
  // Keep track of the scanning state internally to prevent race conditions
  const isScanningRef = useRef(false);
  const scannerContainerId = "qr-reader"; // <<< ID cho div chứa camera view

  // Hàm xử lý khi quét thành công
  const onScanSuccess = (decodedText: string, decodedResult: Html5QrcodeResult) => {
    // Don't process scans if we are no longer in scanning mode
    if (!isScanningRef.current) return;

    console.log(`Scan result: ${decodedText}`, decodedResult);
    try {
      // *** QUAN TRỌNG: Parse dữ liệu quét được ***
      const parsedData: ScannedData = JSON.parse(decodedText);

      // *** (Tùy chọn) Thực hiện kiểm tra dữ liệu ở đây ***
      // Ví dụ: Kiểm tra timestamp có hợp lệ không (vd: trong vòng 5 phút)
      // const now = Date.now();
      // const fiveMinutes = 5 * 60 * 1000;
      // if (now - parsedData.timestamp > fiveMinutes) {
      //   toast({ variant: "destructive", title: "Mã QR hết hạn", description: `Mã của ${parsedData.name} đã quá hạn.` });
      //   return; // Bỏ qua nếu hết hạn
      // }

      setScanResult(parsedData); // Lưu kết quả hợp lệ
      setScanCount((prev) => prev + 1);
      toast({
        title: "Điểm danh thành công",
        description: `${parsedData.name} (ID: ${parsedData.id}) đã điểm danh lúc ${new Date().toLocaleTimeString()}`,
      });

      // Tùy chọn: Dừng quét sau khi thành công
      // stopScanner();

    } catch (error) {
      console.error("Lỗi khi parse dữ liệu QR:", error);
      setScanResult(null); // Clear previous successful scan if current one fails parsing
      toast({
        variant: "destructive",
        title: "Lỗi định dạng QR",
        description: "Không thể đọc dữ liệu từ mã QR này.",
      });
    }
  };

  // Hàm xử lý khi có lỗi quét (ví dụ: không tìm thấy QR)
  const onScanFailure = (error: any) => {
    // Don't log 'No QR code found' frequently if scanning
    if (isScanningRef.current && !(error instanceof Object && 'toString' in error && error.toString().includes("No QR code found."))) {
       console.warn(`QR error = ${error}`);
       // Avoid continuous toasts for scan failures
    }
  };

  // Revised Stop Scanner: Prioritize React state change
  const stopScanner = async () => {
    console.log("Attempting to stop scanner (Revised)...");
    const scannerInstance = scannerRef.current; // Grab instance before potential nullification

    // 1. Update React state FIRST to remove the container div
    isScanningRef.current = false;
    setIsScanning(false);
    scannerRef.current = null; // Nullify ref immediately

    // 2. Give React a moment to process the state change and unmount the div
    await new Promise(resolve => setTimeout(resolve, 50)); // Short delay

    // 3. Now try to clean up the scanner instance *if it existed*
    if (scannerInstance) {
      try {
        // Attempt to clear, but anticipate it might fail if element is gone
        await scannerInstance.clear();
        console.log("QR Scanner cleared successfully (or was already gone).");
      } catch (err) {
        // Log error, but don't treat it as critical if it's about missing element
        console.warn("Error during scannerInstance.clear() (might be expected if element removed by React):", err);
      }
    } else {
      console.log("Scanner instance reference was already null or cleared.");
    }
  };

  // Revised Start Scanner: More robust error handling and logging
  const startScanner = () => {
    console.log("Attempting to start scanner (Revised)...");
    if (isScanningRef.current) {
      console.log("Scanner is already starting or running.");
      return;
    }
    // Ensure scanner ref is null before starting
    if (scannerRef.current) {
       console.warn("Scanner ref was not null before starting. Attempting cleanup...");
       stopScanner().finally(() => { // Ensure stop completes before trying to start again
         // Now try starting after cleanup attempt
         requestAnimationFrame(startScannerInternal);
       });
       return; // Exit for now, let the cleanup attempt finish
    }

    // Proceed with starting directly if ref is already null
    startScannerInternal();
  };

  const startScannerInternal = () => {
    // Double check ref and state before proceeding after potential async cleanup
    if (scannerRef.current || isScanningRef.current) {
      console.log("Scanner start aborted after cleanup attempt, already started or ref not null.");
      return;
    }

    isScanningRef.current = true;
    setIsScanning(true); // Render the container div
    setScanResult(null);
    setScanCount(0); // Reset scan count

    // Delay to allow DOM update
    setTimeout(() => {
      if (!isScanningRef.current) {
        console.log("Scanning cancelled before initialization.");
        // No need to setIsScanning(false) here as stopScanner should handle it if called
        return;
      }

      const containerElement = document.getElementById(scannerContainerId);
      if (!containerElement) {
        console.error(`Container element with id '${scannerContainerId}' not found after timeout.`);
        toast({ variant: "destructive", title: "Lỗi Giao Diện", description: "Không tìm thấy khu vực hiển thị camera." });
        isScanningRef.current = false;
        setIsScanning(false); // Revert state on critical error
        return;
      }

      console.log("Initializing Html5QrcodeScanner in container:", scannerContainerId);
      try {
        // Ensure verbose is false or handle logs appropriately
        const scanner = new Html5QrcodeScanner(
          scannerContainerId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            // Consider adding facingMode if needed:
            // facingMode: "environment" // Prioritize rear camera
            aspectRatio: 1.0 // Match the container aspect ratio if possible
          },
          /* verbose= */ false
        );

        // Add specific logging for render call
        console.log("Calling scanner.render()...");
        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner; // Store the instance *after* render call succeeds
        console.log("Scanner render called successfully.");

      } catch (error) {
        console.error("Failed to initialize or render scanner:", error);
        toast({
          variant: "destructive",
          title: "Lỗi Camera/Scanner",
          description: `Không thể khởi động. Lỗi: ${error instanceof Error ? error.message : String(error)}`,
        });
        // Attempt cleanup on error by calling stopScanner
        stopScanner(); // Call the revised stop function
      }
    }, 150); // Slightly longer delay
  }

  // Revised Effect Cleanup
  useEffect(() => {
    return () => {
      console.log("QrScanner component unmounting, ensuring scanner is stopped (Revised).");
      // Check internal ref state before attempting to stop
      if (isScanningRef.current || scannerRef.current) {
        // stopScanner is async, but useEffect cleanup itself isn't.
        // We call it fire-and-forget style. It handles internal state.
        stopScanner();
      }
    };
  }, []); // Empty dependency array means this runs only on unmount

  return (
    <div className="space-y-4">
      {/* Conditionally render either the placeholder or the scanner container */}
      {!isScanning ? (
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-800 flex flex-col items-center justify-center h-full text-center text-gray-400">
          <Camera className="mx-auto h-12 w-12" />
          <p className="mt-2 text-sm">Nhấn "Bắt đầu quét" để kích hoạt máy ảnh</p>
        </div>
      ) : (
         // Container for html5-qrcode to render into. MUST be present in the DOM before scanner.render() is called.
        <div id={scannerContainerId} className="aspect-square w-full overflow-hidden rounded-lg bg-gray-900 border border-gray-700 relative">
          {/* html5-qrcode will inject its UI here. Leave this empty. */}
           {/* Optional: add a loading indicator */}
           {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">Đang tải camera...</div> */}
        </div>
      )}

      {/* Display latest scan result */}
      {scanResult && (
        <div className="rounded-lg border p-3 text-center bg-green-50 border-green-200">
            <p className="text-sm font-medium text-green-800">Quét thành công: {scanResult.name}</p>
            <p className="text-xs text-muted-foreground">ID: {scanResult.id} - Lớp: {scanResult.class}</p>
            <p className="text-xs text-muted-foreground">Timestamp: {new Date(scanResult.timestamp).toLocaleString()}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center gap-2">
        {!isScanning ? (
          <Button onClick={startScanner} className="bg-red-700 hover:bg-red-800">
            <Camera className="mr-2 h-4 w-4" />
            Bắt đầu quét
          </Button>
        ) : (
          // Use the async stopScanner here
          <Button onClick={stopScanner} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Dừng quét
          </Button>
        )}
      </div>
       {/* Optional: Show scan count */}
       {isScanning && scanCount > 0 && <p className="text-center text-sm text-muted-foreground">Đã quét thành công: {scanCount} lượt</p>}
    </div>
  )
}