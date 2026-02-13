export const storage = {
    get: (key, version = 'v1', schema = null, migrateFn = null, alternateKey = null) => {
        try {
            let raw = localStorage.getItem(key);

            // Auto-Migration: If key not found but alternateKey exists
            if (!raw && alternateKey) {
                const oldRaw = localStorage.getItem(alternateKey);
                if (oldRaw) {
                    console.info(`Migrating data from legacy key '${alternateKey}' to '${key}'`);
                    // Check if old data is wrapped or plain
                    let oldData;
                    try {
                        const parsed = JSON.parse(oldRaw);
                        // If it has _version, it's a wrapper, take value. If not, it's raw data.
                        oldData = parsed._version ? parsed.value : parsed;
                    } catch {
                        oldData = oldRaw; // Should be JSON but fallback
                    }

                    // Run migrateFn if provided to transform data structure
                    if (migrateFn) {
                        oldData = migrateFn(oldData, 'legacy');
                    }

                    // Save to new key immediately
                    const wrapper = {
                        _version: version,
                        _timestamp: new Date().toISOString(),
                        value: oldData
                    };
                    localStorage.setItem(key, JSON.stringify(wrapper));
                    localStorage.removeItem(alternateKey); // Clean up old key

                    raw = localStorage.getItem(key); // Reload
                }
            }

            if (!raw) return null;

            const data = JSON.parse(raw);

            // Version check
            if (data._version !== version) {
                if (migrateFn) {
                    console.info(`Migrating ${key} from ${data._version || 'v0'} to ${version}`);
                    // Basic migration: if migrateFn provided, use it. Otherwise, if versions mismatch and no migrateFn, we might clear or return as is depending on policy.
                    // Here we assume migrateFn takes old data and returns new data format
                    const migrated = migrateFn(data.value, data._version);
                    // We don't save immediately to avoid side effects in get(), but we could.
                    // Let's return migrated data.
                    return schema ? schema.parse(migrated) : migrated;
                } else {
                    console.warn(`Version mismatch for ${key} (${data._version} vs ${version}). Clearing data.`);
                    localStorage.removeItem(key);
                    return null;
                }
            }

            // Schema Validation
            if (schema) {
                try {
                    return schema.parse(data.value);
                } catch (validationError) {
                    console.error(`Schema validation failed for ${key}:`, validationError);
                    console.warn(`Resetting ${key} due to validation error.`);
                    localStorage.removeItem(key);
                    return null;
                }
            }

            return data.value;
        } catch (e) {
            console.error(`Error reading ${key}`, e);
            localStorage.removeItem(key); // Safe reset on JSON parse error
            return null;
        }
    },

    set: (key, value, version = 'v1') => {
        try {
            const wrapper = {
                _version: version,
                _timestamp: new Date().toISOString(),
                value
            };
            localStorage.setItem(key, JSON.stringify(wrapper));
        } catch (e) {
            console.error(`Error writing ${key}`, e);
        }
    },

    remove: (key) => {
        localStorage.removeItem(key);
    }
};
