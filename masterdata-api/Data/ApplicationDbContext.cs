using masterdataapi.Models;
using Microsoft.EntityFrameworkCore;

namespace masterdata_api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<WindTurbine> WindTurbines { get; set; } = null!;
    public DbSet<Site> Sites { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<WindTurbine>(entity =>
        {
            entity.HasIndex(e => e.Gsrn).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasOne(e => e.Site)
                .WithMany(s => s.WindTurbines)
                .HasForeignKey(e => e.SiteId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Site>(entity =>
        {
            entity.HasIndex(e => e.SfEjendomsNr);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}
