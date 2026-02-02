import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type {Neighborhood} from "@/data/locations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    districtsByProvince,
    neighborhoodsByProvinceAndDistrict,
    provinces
} from "@/data/locations";

interface LocationComboboxProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    name: string;
    label: string;
    placeholder: string;
    searchPlaceholder: string;
    emptyMessage: string;
    options: string[];
    disabled: boolean;
    onSelect?: () => void;
    autoOpen?: boolean;
}

function LocationCombobox({
    form,
    name,
    label,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    options,
    disabled,
    onSelect,
    autoOpen = false,
}: LocationComboboxProps) {
    const [open, setOpen] = React.useState(false);

    // Auto-open when autoOpen prop changes to true
    React.useEffect(() => {
        if (autoOpen && !disabled && options.length > 0) {
            const timer = setTimeout(() => {
                setOpen(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [autoOpen, disabled, options.length]);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    disabled={disabled}
                                    className={cn(
                                        "w-full justify-between text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <span className="truncate">
                                        {field.value || placeholder}
                                    </span>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            style={{ width: "var(--radix-popovertrigger-width)" }}
                            className="p-0"
                            align="start"
                        >
                            <Command>
                                <CommandInput placeholder={searchPlaceholder} />
                                <CommandList>
                                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option}
                                                value={option}
                                                onSelect={(value) => {
                                                    field.onChange(value);
                                                    setOpen(false);
                                                    onSelect?.();
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value === option
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {option}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface NeighborhoodComboboxProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    label: string;
    placeholder: string;
    searchPlaceholder: string;
    emptyMessage: string;
    neighborhoods: Neighborhood[];
    disabled: boolean;
    autoOpen?: boolean;
    onSelect?: () => void;
}

function NeighborhoodCombobox({
    form,
    label,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    neighborhoods,
    disabled,
    autoOpen = false,
    onSelect,
}: NeighborhoodComboboxProps) {
    const [open, setOpen] = React.useState(false);

    // Auto-open when autoOpen prop changes to true
    React.useEffect(() => {
        if (autoOpen && !disabled && neighborhoods.length > 0) {
            const timer = setTimeout(() => {
                setOpen(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [autoOpen, disabled, neighborhoods.length]);

    return (
        <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    disabled={disabled}
                                    className={cn(
                                        "w-full justify-between text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <span className="truncate">
                                        {field.value || placeholder}
                                    </span>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            style={{ width: "var(--radix-popovertrigger-width)" }}
                            className="p-0"
                            align="start"
                        >
                            <Command>
                                <CommandInput placeholder={searchPlaceholder} />
                                <CommandList>
                                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                                    <CommandGroup>
                                        {neighborhoods.map((neighborhood) => (
                                            <CommandItem
                                                key={neighborhood.id}
                                                value={neighborhood.name}
                                                onSelect={() => {
                                                    field.onChange(neighborhood.name);
                                                    setOpen(false);
                                                    onSelect?.();
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value === neighborhood.name
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {neighborhood.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface LocationSelectProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    onLocationChange?: (location: { province: string; district: string; neighborhood: string }) => void;
}

export default function LocationSelect({ form, onLocationChange }: LocationSelectProps) {
    const selectedProvince = form.watch("province") as string;
    const selectedDistrict = form.watch("district") as string;

    const isProvinceMounted = React.useRef(false);
    const isDistrictMounted = React.useRef(false);

    const [autoOpenDistrict, setAutoOpenDistrict] = React.useState(false);
    const [autoOpenNeighborhood, setAutoOpenNeighborhood] = React.useState(false);

    const districts = selectedProvince
        ? (districtsByProvince[selectedProvince] || [])
        : [];

    // Combine province and district to create unique key
    const neighborhoodKey = selectedProvince && selectedDistrict
        ? `${selectedProvince}|${selectedDistrict}`
        : null;

    const neighborhoods = neighborhoodKey
        ? (neighborhoodsByProvinceAndDistrict[neighborhoodKey] || [])
        : [];

    // İl değiştiğinde ilçe ve mahalle sıfırla
    React.useEffect(() => {
        if (!isProvinceMounted.current) {
            isProvinceMounted.current = true;
            return;
        }
        form.setValue("district", "");
        form.setValue("neighborhood", "");
    }, [selectedProvince, form]);

    // İlçe değiştiğinde mahalle sıfırla
    React.useEffect(() => {
        if (!isDistrictMounted.current) {
            isDistrictMounted.current = true;
            return;
        }
        form.setValue("neighborhood", "");
    }, [selectedDistrict, form]);

    const handleProvinceSelect = () => {
        setAutoOpenDistrict(false);
        // Trigger auto-open after a brief delay
        setTimeout(() => setAutoOpenDistrict(true), 50);
    };

    const handleDistrictSelect = () => {
        setAutoOpenNeighborhood(false);
        // Trigger auto-open after a brief delay
        setTimeout(() => setAutoOpenNeighborhood(true), 50);
    };

    const handleNeighborhoodSelect = () => {
        // Notify parent when neighborhood is selected
        if (selectedProvince && selectedDistrict) {
            // Use setTimeout to ensure form value is updated before callback
            setTimeout(() => {
                const neighborhood = form.getValues("neighborhood");
                if (neighborhood) {
                    onLocationChange?.({
                        province: selectedProvince,
                        district: selectedDistrict,
                        neighborhood,
                    });
                }
            }, 100);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LocationCombobox
                form={form}
                name="province"
                label="İl *"
                placeholder="İl seçiniz"
                searchPlaceholder="İl ara..."
                emptyMessage="İl bulunamadı."
                options={provinces}
                disabled={false}
                onSelect={handleProvinceSelect}
            />
            <LocationCombobox
                form={form}
                name="district"
                label="İlçe *"
                placeholder="İlçe seçiniz"
                searchPlaceholder="İlçe ara..."
                emptyMessage={selectedProvince ? "İlçe bulunamadı." : "Önce il seçiniz."}
                options={districts}
                disabled={!selectedProvince}
                onSelect={handleDistrictSelect}
                autoOpen={autoOpenDistrict}
            />
            <NeighborhoodCombobox
                form={form}
                label="Mahalle *"
                placeholder="Mahalle seçiniz"
                searchPlaceholder="Mahalle ara..."
                emptyMessage={selectedDistrict ? "Mahalle bulunamadı." : "Önce ilçe seçiniz."}
                neighborhoods={neighborhoods}
                disabled={!selectedDistrict}
                autoOpen={autoOpenNeighborhood}
                onSelect={handleNeighborhoodSelect}
            />
        </div>
    );
}